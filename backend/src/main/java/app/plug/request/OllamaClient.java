package app.plug.request;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

// An open-weight model served on this machine by Ollama. Nothing leaves the laptop: the URL is
// checked to be loopback, and neither the text nor the model's output is logged.
final class OllamaClient {
    private final ObjectMapper mapper;
    private final URI chat;
    private final String model;
    private final HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(2)).build();

    OllamaClient(ObjectMapper mapper, String url, String model) {
        URI base = URI.create(url.endsWith("/") ? url : url + "/");
        if (!List.of("127.0.0.1", "localhost", "[::1]").contains(base.getHost())) {
            throw new IllegalArgumentException("The open-weight model must be served from this machine");
        }
        this.mapper = mapper;
        this.chat = base.resolve("api/chat");
        this.model = model;
    }

    String model() { return model; }

    /** The model's JSON for this schema, or null when it answered with nothing. */
    String chat(String system, String user, Map<String, Object> schema, Duration timeout) throws Exception {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("model", model);
        body.put("stream", false);
        body.put("think", false);
        body.put("format", schema);
        // Stays loaded for the whole demo, so no ask pays to load it again.
        body.put("keep_alive", "2h");
        body.put("options", Map.of("temperature", 0));
        body.put("messages", List.of(Map.of("role", "system", "content", system), Map.of("role", "user", "content", user)));
        HttpRequest request = HttpRequest.newBuilder(chat).timeout(timeout)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(body))).build();
        HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 200) throw new IllegalStateException("ollama_status_" + response.statusCode());
        JsonNode content = mapper.readTree(response.body()).path("message").path("content");
        return content.isTextual() && !content.asText().isBlank() ? content.asText() : null;
    }
}
