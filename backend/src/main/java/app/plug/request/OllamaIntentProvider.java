package app.plug.request;

import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// The same job as ClaudeIntentProvider, done by an open-weight model on this machine. It only
// classifies and reads structure: its JSON goes back to IntentAdapter, which validates every
// field, and any failure falls back to the built-in rules.
final class OllamaIntentProvider implements IntentAdapter.Provider {
    private static final Logger LOG = LoggerFactory.getLogger(OllamaIntentProvider.class);
    private static final Map<String, Object> NULLABLE_STRING = Map.of("type", List.of("string", "null"));
    private static final Map<String, Object> NULLABLE_INTEGER = Map.of("type", List.of("integer", "null"));
    private static final Map<String, Object> SCHEMA = Map.of(
            "type", "object",
            "additionalProperties", false,
            "required", List.of("ask_type", "skill_tags", "place_name", "budget_cents", "needed_by", "max_distance_m",
                    "service_label", "restricted"),
            "properties", Map.of(
                    "ask_type", Map.of("type", "string", "enum", List.of("service_request", "place_question", "unclear")),
                    "skill_tags", Map.of("type", "array", "items", Map.of("type", "string")),
                    "place_name", NULLABLE_STRING,
                    "budget_cents", NULLABLE_INTEGER,
                    "needed_by", NULLABLE_STRING,
                    "max_distance_m", NULLABLE_INTEGER,
                    "service_label", NULLABLE_STRING,
                    "restricted", Map.of("type", "boolean")));

    // A smaller model reaches for the closest-sounding tag, which turns regrouting tiles into plumbing.
    private static final String PRECISION = """
            Choose a tag only when it clearly names this exact job. If none does, return an empty skill_tags
            list and put the job in service_label ("regrout my bathroom tiles" has no tag, so its service_label
            is "Regrout bathroom tiles"). Never pick the closest-sounding tag.
            """;

    private final OllamaClient client;
    private final String system;

    OllamaIntentProvider(OllamaClient client, SkillVocabulary vocabulary) {
        this.client = client;
        this.system = ClaudeIntentProvider.instructions(vocabulary).replace("Allowed skill tags:", PRECISION + "\nAllowed skill tags:");
    }

    @Override
    public String extract(String text, Instant now, ZoneId zone, Duration deadline) throws Exception {
        long started = System.nanoTime();
        try {
            String json = client.chat(system, "Current time: " + now.atZone(zone) + " (time zone " + zone.getId() + ")\n"
                    + "<request>\n" + text + "\n</request>", SCHEMA, deadline);
            LOG.info("open_weight_read model={} millis={}", client.model(), (System.nanoTime() - started) / 1_000_000);
            return json;
        } catch (Exception failure) {
            LOG.warn("open_weight_failed model={} exception_type={}", client.model(), failure.getClass().getSimpleName());
            throw failure;
        }
    }
}
