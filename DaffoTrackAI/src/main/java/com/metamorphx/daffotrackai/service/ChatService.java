package com.metamorphx.daffotrackai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.metamorphx.daffotrackai.dto.ChatRequest;
import com.metamorphx.daffotrackai.dto.ChatResponse;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;

// Spring AI Imports for RAG
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class ChatService {

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final String apiKey;
    private final String model;
    private final String responsesUrl;
    private final String groqApiKey;
    private final String groqModel;
    private final String groqChatUrl;
    private final String xaiApiKey;
    private final String xaiModel;
    private final String xaiChatUrl;
    private final ChatHistoryService chatHistoryService;

    // Pinecone VectorStore initialization
    private final VectorStore vectorStore;

    public ChatService(
            @Value("${openai.api-key:}") String apiKey,
            @Value("${openai.model:gpt-5.5}") String model,
            @Value("${openai.responses-url:https://api.openai.com/v1/responses}") String responsesUrl,
            @Value("${groq.api-key:}") String groqApiKey,
            @Value("${groq.model:llama-3.3-70b-versatile}") String groqModel,
            @Value("${groq.chat-url:https://api.groq.com/openai/v1/chat/completions}") String groqChatUrl,
            @Value("${xai.api-key:}") String xaiApiKey,
            @Value("${xai.model:grok-beta}") String xaiModel,
            @Value("${xai.chat-url:https://api.x.ai/v1/chat/completions}") String xaiChatUrl,
            ChatHistoryService chatHistoryService,
            VectorStore vectorStore // Injected VectorStore
    ) {
        this.objectMapper = new ObjectMapper();
        this.apiKey = apiKey;
        this.model = model;
        this.responsesUrl = responsesUrl;
        this.groqApiKey = groqApiKey;
        this.groqModel = groqModel;
        this.groqChatUrl = groqChatUrl;
        this.xaiApiKey = xaiApiKey;
        this.xaiModel = xaiModel;
        this.xaiChatUrl = xaiChatUrl;
        this.chatHistoryService = chatHistoryService;
        this.vectorStore = vectorStore;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    public ChatResponse ask(ChatRequest request) {
        String message = request.message() == null ? "" : request.message().trim();
        if (message.isBlank()) {
            return new ChatResponse("error", "Please send a message so I can help you with DIU rules and academic guidance.");
        }

        if (request.conversationId() != null) {
            chatHistoryService.addMessage(
                    request.conversationId(),
                    request.userId(),
                    request.studentId(),
                    "user",
                    message,
                    request.attachmentsJson()
            );
        }

        String responseText;
        if (StringUtils.hasText(xaiApiKey)) {
            try {
                responseText = askXai(request.studentId(), message);
                saveAiMessage(request, responseText);
                return new ChatResponse("success", responseText);
            } catch (Exception exception) {
                responseText = fallbackResponse(message) + "\n\nxAI service fallback: " + exception.getMessage();
                saveAiMessage(request, responseText);
                return new ChatResponse("fallback", responseText);
            }
        }

        if (StringUtils.hasText(groqApiKey)) {
            try {
                responseText = askGroq(request.studentId(), message);
                saveAiMessage(request, responseText);
                return new ChatResponse("success", responseText);
            } catch (Exception exception) {
                responseText = fallbackResponse(message) + "\n\nGroq service fallback: " + exception.getMessage();
                saveAiMessage(request, responseText);
                return new ChatResponse("fallback", responseText);
            }
        }

        if (StringUtils.hasText(apiKey)) {
            try {
                responseText = askOpenAi(request.studentId(), message);
                saveAiMessage(request, responseText);
                return new ChatResponse("success", responseText);
            } catch (Exception exception) {
                responseText = fallbackResponse(message) + "\n\nAI service fallback: " + exception.getMessage();
                saveAiMessage(request, responseText);
                return new ChatResponse("fallback", responseText);
            }
        }

        responseText = fallbackResponse(message) + "\n\nSet XAI_API_KEY, GROQ_API_KEY, or OPENAI_API_KEY to enable real AI responses.";
        saveAiMessage(request, responseText);
        return new ChatResponse("fallback", responseText);
    }

    private void saveAiMessage(ChatRequest request, String responseText) {
        if (request.conversationId() == null) return;
        chatHistoryService.addMessage(
                request.conversationId(),
                request.userId(),
                request.studentId(),
                "ai",
                responseText,
                null
        );
    }

    // Similarity Search Method for RAG
    private String getDIURulesFromPinecone(String message) {
        try {
            List<Document> results = vectorStore.similaritySearch(
                    SearchRequest.query(message).withTopK(3)
            );

            if (results == null || results.isEmpty()) {
                return "";
            }

            StringBuilder contextBuilder = new StringBuilder();
            contextBuilder.append("\n\n[Important Context from DIU Knowledge Base]:\n");
            for (Document doc : results) {
                contextBuilder.append("- ").append(doc.getContent()).append("\n");
            }
            return contextBuilder.toString();
        } catch (Exception e) {
            System.out.println("Vector DB Search Failed: " + e.getMessage());
            return ""; // Failsafe: if DB fails, return empty context
        }
    }

    private String askXai(String studentId, String message) throws Exception {
        String dbContext = getDIURulesFromPinecone(message); // Fetch Context

        Map<String, Object> payload = Map.of(
                "model", xaiModel,
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt(studentId, dbContext)),
                        Map.of("role", "user", "content", message)
                ),
                "temperature", 0.3
        );

        String body = objectMapper.writeValueAsString(payload);
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(xaiChatUrl))
                .timeout(Duration.ofSeconds(45))
                .header("Authorization", "Bearer " + xaiApiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new IllegalStateException("xAI request failed with status " + response.statusCode() + ": " + extractErrorMessage(response.body()));
        }

        return extractChatCompletionText(response.body());
    }

    private String askGroq(String studentId, String message) throws Exception {
        String dbContext = getDIURulesFromPinecone(message); // Fetch Context

        Map<String, Object> payload = Map.of(
                "model", groqModel,
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt(studentId, dbContext)),
                        Map.of("role", "user", "content", message)
                ),
                "temperature", 0.4,
                "max_completion_tokens", 700
        );

        String body = objectMapper.writeValueAsString(payload);
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(groqChatUrl))
                .timeout(Duration.ofSeconds(45))
                .header("Authorization", "Bearer " + groqApiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new IllegalStateException(groqErrorMessage(response.statusCode(), response.body()));
        }

        return extractChatCompletionText(response.body());
    }

    private String askOpenAi(String studentId, String message) throws Exception {
        String dbContext = getDIURulesFromPinecone(message); // Fetch Context

        Map<String, Object> payload = Map.of(
                "model", model,
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt(studentId, dbContext)),
                        Map.of("role", "user", "content", message)
                ),
                "temperature", 0.7
        );

        String body = objectMapper.writeValueAsString(payload);
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(responsesUrl))
                .timeout(Duration.ofSeconds(45))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new IllegalStateException(openAiErrorMessage(response.statusCode(), response.body()));
        }

        return extractChatCompletionText(response.body());
    }

    private String openAiErrorMessage(int statusCode, String responseBody) {
        String apiMessage = extractErrorMessage(responseBody);
        if (statusCode == 429) {
            return "OpenAI rate limit or quota problem (429). "
                    + apiMessage
                    + " Check OpenAI billing/credits, wait for the rate limit window, or use a lower-cost model via OPENAI_MODEL.";
        }

        if (statusCode == 401) {
            return "OpenAI authentication failed (401). Check that OPENAI_API_KEY is set correctly.";
        }

        if (statusCode == 400) {
            return "OpenAI rejected the request (400). " + apiMessage + " Check the configured OPENAI_MODEL value.";
        }

        return "OpenAI request failed with status " + statusCode + ". " + apiMessage;
    }

    private String groqErrorMessage(int statusCode, String responseBody) {
        String apiMessage = extractErrorMessage(responseBody);
        if (statusCode == 401) {
            return "Groq authentication failed (401). Check that GROQ_API_KEY is set correctly.";
        }

        if (statusCode == 400) {
            return "Groq rejected the request (400). " + apiMessage + " Check GROQ_MODEL.";
        }

        if (statusCode == 429) {
            return "Groq rate limit reached (429). " + apiMessage + " Wait and retry, or switch GROQ_MODEL.";
        }

        return "Groq request failed with status " + statusCode + ". " + apiMessage;
    }

    private String extractErrorMessage(String responseBody) {
        if (!StringUtils.hasText(responseBody)) {
            return "";
        }

        try {
            JsonNode error = objectMapper.readTree(responseBody).path("error");
            String message = error.path("message").asText("");
            String type = error.path("type").asText("");
            String code = error.path("code").asText("");
            return List.of(message, type, code)
                    .stream()
                    .filter(StringUtils::hasText)
                    .reduce((left, right) -> left + " [" + right + "]")
                    .orElse("");
        } catch (Exception ignored) {
            return responseBody.length() > 240 ? responseBody.substring(0, 240) : responseBody;
        }
    }

    private String extractOutputText(String responseBody) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody);
        JsonNode outputText = root.get("output_text");
        if (outputText != null && outputText.isTextual() && StringUtils.hasText(outputText.asText())) {
            return outputText.asText();
        }

        JsonNode output = root.get("output");
        if (output != null && output.isArray()) {
            for (JsonNode item : output) {
                JsonNode content = item.get("content");
                if (content == null || !content.isArray()) continue;
                for (JsonNode contentItem : content) {
                    JsonNode text = contentItem.get("text");
                    if (text != null && text.isTextual() && StringUtils.hasText(text.asText())) {
                        return text.asText();
                    }
                }
            }
        }

        return "I received a response from the AI service, but it did not include readable text.";
    }

    private String extractChatCompletionText(String responseBody) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody);
        JsonNode choices = root.get("choices");
        if (choices != null && choices.isArray() && !choices.isEmpty()) {
            JsonNode content = choices.get(0).path("message").path("content");
            if (content.isTextual() && StringUtils.hasText(content.asText())) {
                return content.asText();
            }
        }

        return "I received a response from the AI service, but it did not include readable text.";
    }

    // System Prompt Updated to receive Database Context
    private String systemPrompt(String studentId, String dbContext) {
        return """
                You are DaffoTrack AI, an academic planning assistant for Daffodil International University students.
                Keep answers practical, concise, and specific to academic planning, CGPA, course registration,
                attendance, waiver, makeup exam, retake, and grade improvement questions.
                When the user uploads files, use any extracted file text and metadata included in the user message.
                Do not claim that you cannot access an attachment if extracted context is present; instead explain
                what you can infer from the provided context and ask for missing file contents only when necessary.
                If a rule is uncertain, say that the student should verify with DIU administration or department office.
                Never ask for passwords or sensitive private data.
                
                Use the provided [Important Context from DIU Knowledge Base] below to answer the user's questions accurately.
                If the answer is not in the context, give a general logical answer but advise verifying with the department.
                
                Current student ID context: %s
                %s
                """.formatted(
                StringUtils.hasText(studentId) ? studentId : "unknown",
                dbContext == null ? "" : dbContext
        );
    }

    private String fallbackResponse(String message) {
        String normalized = message.toLowerCase();

        if (normalized.contains("waiver") || normalized.contains("scholarship") || normalized.contains("discount")) {
            return "According to the configured DIU waiver guidance:\n1. Keep at least 12 credits when waiver eligibility matters.\n2. Maintain SGPA 3.00+ with no F, I, or W grades.\n3. Higher CGPA brackets may qualify for stronger waiver percentages.";
        }

        if (normalized.contains("makeup") || normalized.contains("miss") || normalized.contains("sick")) {
            return "For makeup exams, apply quickly with valid evidence, get department approval, and follow the accounts/administrative payment process.";
        }

        if (normalized.contains("improve") || normalized.contains("retake") || normalized.contains("grade")) {
            return "For weak grades, retake is required for F grades and improvement can help when allowed by department policy. Confirm registration timing before planning.";
        }

        if (normalized.contains("attendance") || normalized.contains("75%") || normalized.contains("attend")) {
            return "Track attendance per course. A 75% course attendance threshold is the common final-exam safety line.";
        }

        return "I can help with CGPA planning, DIU policy, course registration, waiver safety, attendance, retake, improvement, and makeup exam questions.";
    }
}