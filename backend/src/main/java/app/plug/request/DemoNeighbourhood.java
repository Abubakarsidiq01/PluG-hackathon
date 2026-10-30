package app.plug.request;

import app.plug.request.RequestPayloads.PlaceProgress;
import app.plug.request.RequestPayloads.PlaceQuestion;
import app.plug.request.RequestPayloads.Resource;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.springframework.jdbc.core.JdbcTemplate;

/// Hackathon demo mode (ADR-015), off unless PLUG_DEMO_MODE=true and refused outside a local run.
/// Real providers and neighbours arrive in Phases 3 and 4, so this stands in a simulated
/// neighbourhood that answers every ask. All of it is sample data: providers carry a demo address,
/// offers stay Estimated, and the app shows a demo notice on every answer.
final class DemoNeighbourhood {
    private static final List<String> PROVIDERS = List.of("Amara K.", "Marcus T.", "Priya S.", "Tolu A.", "Jess R.", "Diego M.",
            "Hannah L.", "Kwame O.", "Sofia G.", "Andre W.", "Mei C.", "Noor H.");
    private static final List<String> INITIALS = List.of("DM", "RK", "AO", "JT", "SL", "MB", "TN", "EP");
    private static final int[] METRES = {420, 850, 1300};
    private static final int[] BUDGET_PERCENT = {72, 85, 96};
    private static final double[] PRICE_STEP = {1.0, 1.15, 1.3};
    private static final int[] MINUTES_OUT = {35, 50, 75};
    private static final Duration REPLY_GAP = Duration.ofMillis(1500);
    private static final Duration ANSWER_AFTER = Duration.ofSeconds(5);
    private static final Duration MODEL_LIMIT = Duration.ofSeconds(20);
    private static final String SYSTEM = """
            You write sample data for a live demo of PLUG, an app that asks people near a public place what
            is happening there right now. Invent three short first-person reports from simulated neighbours,
            all agreeing, that directly answer the question. Then combine them.
            value: the direct answer as a headline of at most 24 characters.
            - Asked how long or about a line, queue or wait: a time range, like "12-15 min".
            - Asked about parking: like "A few spots left" or "Plenty of parking".
            - Asked if it is busy or crowded: like "Moderately busy" or "Quiet right now".
            - Asked if it is open: like "Open until 9 PM".
            summary: one full sentence of 10 to 25 words, starting "Three people nearby say", that restates
            the reports and agrees with value. Do not put numbers or times in the summary.
            Mention no real people, and nothing about safety, crime or private homes.
            Example. Question: Is the gym busy? {"reports":["Most machines are taken","There is a short wait
            for benches","Busy but moving"],"value":"Moderately busy","summary":"Three people nearby say most
            machines are taken but people are moving through quickly."}
            """;
    private static final Map<String, Object> SCHEMA = Map.of("type", "object", "required", List.of("reports", "value", "summary"),
            "properties", Map.of("reports", Map.of("type", "array", "items", Map.of("type", "string")),
                    "value", Map.of("type", "string"), "summary", Map.of("type", "string")));

    @JsonInclude(JsonInclude.Include.ALWAYS)
    record Source(String initials, Instant answeredAt) {}
    @JsonInclude(JsonInclude.Include.ALWAYS)
    record Answer(String value, String summary, String truthLabel, List<Source> sources, Instant expiresAt) {}
    record Words(String value, String summary) {}
    private record Open(Instant startedAt, CompletableFuture<Words> words) {}

    private final JdbcTemplate jdbc;
    private final Clock clock;
    private final ObjectMapper mapper;
    private final OllamaClient model;
    private final Map<String, Open> questions = new ConcurrentHashMap<>();
    private final ExecutorService pool = Executors.newSingleThreadExecutor(task -> {
        Thread thread = new Thread(task, "demo-neighbours");
        thread.setDaemon(true);
        return thread;
    });

    DemoNeighbourhood(JdbcTemplate jdbc, Clock clock, ObjectMapper mapper, OllamaClient model) {
        this.jdbc = jdbc;
        this.clock = clock;
        this.mapper = mapper;
        this.model = model;
    }

    /// Three sample providers made for this request, always inside its budget and deadline.
    void seedProviders(Resource resource) {
        var c = resource.constraints();
        int hash = Math.floorMod(resource.requestId().hashCode(), PROVIDERS.size());
        String service = c.serviceName() == null || c.serviceName().isBlank() ? "Local help" : c.serviceName();
        String category = c.skillTags().isEmpty() ? "demo" : c.skillTags().getFirst();
        Instant now = clock.instant();
        for (int i = 0; i < METRES.length; i++) {
            String place = "plc_demo-" + UUID.randomUUID();
            int metres = Math.min(METRES[i], c.maxDistanceM());
            double degrees = metres / 111_000.0;
            jdbc.update("INSERT INTO places(id,name,address,category,location) VALUES(?,?,'Demo neighbourhood',?,"
                    + "ST_SetSRID(ST_MakePoint(?,?),4326)::geography)", place, PROVIDERS.get((hash + i) % PROVIDERS.size()), category,
                    c.location().longitude() + degrees * (i - 1), c.location().latitude() + degrees / 2);
            jdbc.update("INSERT INTO supplier_seeds(place_id,service_name,price_cents,available_after_minutes,valid_for_minutes)"
                    + " VALUES(?,?,?,?,180)", place, service.length() > 80 ? service.substring(0, 80) : service,
                    priceCents(c.budgetCents(), hash, i), minutesOut(c.neededBy(), now, i));
            jdbc.update("INSERT INTO request_seed_work(request_id,place_id,distance_m) VALUES(?,?,?)",
                    resource.requestId(), place, metres);
        }
    }

    /// On stage a service no skill matched goes straight to offers under a plain name. The restricted
    /// policy has already run by now, so nothing refused can reach this.
    static IntentAdapter.Result withoutQuestion(IntentAdapter.Result result) {
        var c = result.constraints();
        if (result.clarificationField() == null || c == null) return result;
        return new IntentAdapter.Result(IntentAdapter.AskType.SERVICE_REQUEST, new RequestPayloads.Constraints("handyman", "Local help",
                List.of("handyman"), false, c.budgetCents(), c.currency(), c.neededBy(), c.maxDistanceM(), c.location()),
                null, null, null);
    }

    /// Replies arrive one at a time, so the counters visibly move on stage.
    boolean readyForNextReply(Resource resource) {
        return !resource.updatedAt().plus(REPLY_GAP).isAfter(clock.instant());
    }

    void open(String questionId, String text, String place) {
        questions.put(questionId, new Open(clock.instant(),
                CompletableFuture.supplyAsync(() -> words(text, place), pool)));
    }

    /// The stored question with its simulated progress and, once ready, its answer.
    PlaceQuestion overlay(PlaceQuestion stored) {
        Open open = questions.get(stored.questionId());
        if (open == null) return stored;
        long millis = Duration.between(open.startedAt(), clock.instant()).toMillis();
        boolean ready = millis >= ANSWER_AFTER.toMillis() && open.words().isDone();
        if (!ready) {
            return new PlaceQuestion(stored.questionId(), stored.text(), stored.placeName(), "asking",
                    new PlaceProgress(3, Math.min(3, 1 + (int) (millis / 900)), Math.min(3, (int) (millis / 1600))), null, null,
                    stored.createdAt(), stored.expiresAt());
        }
        Words words = open.words().join();
        int start = Math.floorMod(stored.questionId().hashCode(), INITIALS.size());
        List<Source> sources = List.of(new Source(INITIALS.get(start), open.startedAt().plusSeconds(4)),
                new Source(INITIALS.get((start + 1) % INITIALS.size()), open.startedAt().plusSeconds(3)),
                new Source(INITIALS.get((start + 2) % INITIALS.size()), open.startedAt().plusSeconds(2)));
        return new PlaceQuestion(stored.questionId(), stored.text(), stored.placeName(), "answered", new PlaceProgress(3, 3, 3),
                new Answer(words.value(), words.summary(), "confirmed", sources, stored.expiresAt()), null,
                stored.createdAt(), stored.expiresAt());
    }

    private Words words(String text, String place) {
        if (model != null) {
            try {
                String json = model.chat(SYSTEM, "Question: " + text + "\nPlace: " + place, SCHEMA, MODEL_LIMIT);
                Words parsed = json == null ? null : parse(json);
                if (parsed != null) return parsed;
            } catch (Exception failure) {
                org.slf4j.LoggerFactory.getLogger(DemoNeighbourhood.class).warn("open_weight_answer_failed exception_type={}",
                        failure.getClass().getSimpleName());
            }
        }
        return fallback(text);
    }

    private Words parse(String json) throws Exception {
        JsonNode node = mapper.readTree(json);
        String value = node.path("value").asText("").replaceAll("\\s+:\\s*", " ").strip();
        String summary = node.path("summary").asText("").replaceAll("\\s+:\\s*", " ").strip();
        // One or two words is the model echoing the headline, not summarising anyone.
        boolean valid = !value.isEmpty() && value.length() <= 40 && summary.split("\\s+").length >= 6 && summary.length() <= 400
                && (value + summary).codePoints().noneMatch(Character::isISOControl);
        return valid ? new Words(value, summary) : null;
    }

    /// When the model is unavailable the demo still answers, from the words of the question.
    static Words fallback(String text) {
        String words = text.toLowerCase(Locale.ROOT);
        if (words.matches(".*\\b(line|queue|wait)\\b.*")) {
            return new Words("12–15 min", "Three people nearby say the line is moving steadily.");
        }
        if (words.matches(".*\\b(busy|packed|crowded|full)\\b.*")) {
            return new Words("Moderately busy", "Three people nearby say it is busy but moving, with room to get in.");
        }
        if (words.contains("park")) return new Words("A few spots left", "Three people nearby say a few spaces are still open.");
        if (words.matches(".*\\b(open|closed)\\b.*")) return new Words("Open now", "Three people nearby say it is open right now.");
        return new Words("Looks normal", "Three people nearby say it looks like a normal day there.");
    }

    static int priceCents(Integer budget, int hash, int index) {
        int cents = budget != null ? budget * BUDGET_PERCENT[index] / 100 : (int) ((3500 + hash * 500) * PRICE_STEP[index]);
        return Math.min(50_000, Math.max(500, cents / 500 * 500));
    }

    /// Soon enough for the stated deadline, and always still in the future when the reply arrives.
    static int minutesOut(Instant neededBy, Instant now, int index) {
        if (neededBy == null) return MINUTES_OUT[index];
        long left = Duration.between(now, neededBy).toMinutes();
        return (int) Math.max(1, Math.min(MINUTES_OUT[index], Math.min(1440, (left * (index + 1)) / 4)));
    }
}
