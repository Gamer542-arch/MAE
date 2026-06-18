import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.io.OutputStream;
import java.io.InputStreamReader;
import java.io.BufferedReader;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.logging.Logger;

public class App {

    private static final Logger LOG = Logger.getLogger(App.class.getName());
    private static final Map<String, Item> store = new ConcurrentHashMap<>();

    record Item(String id, String name, long createdAt) {}

    public static void main(String[] args) throws IOException {
        int port = Integer.parseInt(System.getenv().getOrDefault("PORT", "8080"));
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

        server.createContext("/api/items", exchange -> {
            try {
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    addCorsHeaders(exchange);
                    exchange.sendResponseHeaders(204, -1);
                    return;
                }

                switch (exchange.getRequestMethod().toUpperCase()) {
                    case "GET" -> handleList(exchange);
                    case "POST" -> handleCreate(exchange);
                    default -> sendJson(exchange, 405, "{\"error\":\"method not allowed\"}");
                }
            } catch (Exception e) {
                LOG.severe("request failed: " + e.getMessage());
                sendJson(exchange, 500, "{\"error\":\"internal server error\"}");
            }
        });

        server.createContext("/api/items/", exchange -> {
            try {
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    addCorsHeaders(exchange);
                    exchange.sendResponseHeaders(204, -1);
                    return;
                }

                String path = exchange.getRequestURI().getPath();
                String id = path.substring("/api/items/".length());

                switch (exchange.getRequestMethod().toUpperCase()) {
                    case "GET" -> handleGet(exchange, id);
                    case "DELETE" -> handleDelete(exchange, id);
                    default -> sendJson(exchange, 405, "{\"error\":\"method not allowed\"}");
                }
            } catch (Exception e) {
                LOG.severe("request failed: " + e.getMessage());
                sendJson(exchange, 500, "{\"error\":\"internal server error\"}");
            }
        });

        server.setExecutor(Executors.newVirtualThreadPerTaskExecutor());
        server.start();
        LOG.info("{name} listening on port " + port);
    }

    private static void handleList(HttpExchange exchange) throws IOException {
        StringBuilder json = new StringBuilder("[");
        boolean first = true;
        for (Item item : store.values()) {
            if (!first) json.append(",");
            json.append(toJson(item));
            first = false;
        }
        json.append("]");
        sendJson(exchange, 200, json.toString());
    }

    private static void handleCreate(HttpExchange exchange) throws IOException {
        String body = readBody(exchange);
        String name = extractName(body);
        if (name == null || name.isBlank()) {
            sendJson(exchange, 400, "{\"error\":\"name is required\"}");
            return;
        }

        String id = Long.toHexString(System.currentTimeMillis());
        Item item = new Item(id, name.strip(), System.currentTimeMillis());
        store.put(id, item);
        sendJson(exchange, 201, toJson(item));
    }

    private static void handleGet(HttpExchange exchange, String id) throws IOException {
        Item item = store.get(id);
        if (item == null) {
            sendJson(exchange, 404, "{\"error\":\"item not found\"}");
            return;
        }
        sendJson(exchange, 200, toJson(item));
    }

    private static void handleDelete(HttpExchange exchange, String id) throws IOException {
        Item removed = store.remove(id);
        if (removed == null) {
            sendJson(exchange, 404, "{\"error\":\"item not found\"}");
            return;
        }
        sendJson(exchange, 204, "");
    }

    private static String toJson(Item item) {
        return "{\"id\":\"" + item.id() + "\",\"name\":\"" +
               escapeJson(item.name()) + "\",\"createdAt\":" + item.createdAt() + "}";
    }

    private static String escapeJson(String s) {
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private static String extractName(String json) {
        String key = "\"name\":\"";
        int start = json.indexOf(key);
        if (start < 0) return null;
        start += key.length();
        int end = json.indexOf("\"", start);
        return end > start ? json.substring(start, end) : null;
    }

    private static String readBody(HttpExchange exchange) throws IOException {
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8))) {
            return br.lines().reduce("", (a, b) -> a + b);
        }
    }

    private static void sendJson(HttpExchange exchange, int code, String body) throws IOException {
        addCorsHeaders(exchange);
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(code, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private static void addCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
    }
}
