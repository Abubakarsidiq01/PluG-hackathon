package app.plug.request;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;
import org.junit.jupiter.api.Test;

class DemoNeighbourhoodTest {
    @Test void pricesStayInsideTheBudgetAndTheDatabaseLimits() {
        for (int index = 0; index < 3; index++) {
            int price = DemoNeighbourhood.priceCents(12000, 4, index);
            assertThat(price).isBetween(500, 12000);
            assertThat(price % 500).isZero();
            assertThat(DemoNeighbourhood.priceCents(500, 4, index)).isEqualTo(500);
            assertThat(DemoNeighbourhood.priceCents(null, 11, index)).isBetween(500, 50000);
        }
    }

    @Test void offersArriveBeforeTheDeadline() {
        Instant now = Instant.parse("2026-10-30T12:00:00Z");
        for (int index = 0; index < 3; index++) {
            int minutes = DemoNeighbourhood.minutesOut(now.plus(Duration.ofMinutes(20)), now, index);
            assertThat(minutes).isBetween(1, 20);
            assertThat(DemoNeighbourhood.minutesOut(null, now, index)).isPositive();
            assertThat(DemoNeighbourhood.minutesOut(now.plus(Duration.ofDays(3)), now, index)).isBetween(1, 1440);
        }
    }

    @Test void everyPlaceQuestionHasAnAnswerWithoutTheModel() {
        assertThat(DemoNeighbourhood.fallback("How long is the line at the post office?").value()).isEqualTo("12–15 min");
        assertThat(DemoNeighbourhood.fallback("Is the gym busy?").value()).isEqualTo("Moderately busy");
        assertThat(DemoNeighbourhood.fallback("Is there parking at the farmers market?").value()).isEqualTo("A few spots left");
        assertThat(DemoNeighbourhood.fallback("Is the library open?").value()).isEqualTo("Open now");
        assertThat(DemoNeighbourhood.fallback("What is going on at the mall?").value()).isEqualTo("Looks normal");
    }

    @Test void theOpenWeightModelIsCalledOnlyOnThisMachineAndReturnsItsJson() throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        AtomicReference<String> seen = new AtomicReference<>();
        server.createContext("/api/chat", exchange -> {
            seen.set(new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8));
            byte[] body = "{\"message\":{\"content\":\"{\\\"ok\\\":true}\"}}".getBytes(StandardCharsets.UTF_8);
            exchange.sendResponseHeaders(200, body.length);
            exchange.getResponseBody().write(body);
            exchange.close();
        });
        server.start();
        try {
            var client = new OllamaClient(new ObjectMapper(), "http://127.0.0.1:" + server.getAddress().getPort(), "qwen3:4b");
            assertThat(client.chat("system", "user", Map.of("type", "object"), Duration.ofSeconds(5))).isEqualTo("{\"ok\":true}");
            assertThat(seen.get()).contains("\"model\":\"qwen3:4b\"", "\"stream\":false", "\"format\"");
        } finally {
            server.stop(0);
        }
        org.junit.jupiter.api.Assertions.assertThrows(IllegalArgumentException.class,
                () -> new OllamaClient(new ObjectMapper(), "https://example.com", "qwen3:4b"));
    }
}
