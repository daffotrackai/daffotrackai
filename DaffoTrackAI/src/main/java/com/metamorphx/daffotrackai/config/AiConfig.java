package com.metamorphx.daffotrackai.config;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.embedding.EmbeddingResponse;
import org.springframework.ai.embedding.EmbeddingRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.document.Document;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import java.util.List;
import java.util.Optional;

@Configuration
public class AiConfig {

    /**
     * Provides a fallback EmbeddingModel to prevent startup failure.
     */
    @Bean
    @Primary
    public EmbeddingModel embeddingModel() {
        return new EmbeddingModel() {
            @Override
            public float[] embed(String text) { return new float[1536]; }
            @Override
            public EmbeddingResponse call(EmbeddingRequest request) { return new EmbeddingResponse(List.of()); }
            @Override
            public float[] embed(org.springframework.ai.document.Document document) { return new float[1536]; }
        };
    }

    /**
     * Provides a fallback ChatModel to prevent startup failure.
     */
    @Bean
    @Primary
    public ChatModel chatModel() {
        return new ChatModel() {
            @Override
            public ChatResponse call(Prompt prompt) { return null; }
        };
    }

    /**
     * Provides a fallback VectorStore to prevent startup failure.
     */
    @Bean
    @Primary
    public VectorStore vectorStore() {
        return new VectorStore() {
            @Override
            public void add(List<Document> documents) {}
            @Override
            public Optional<Boolean> delete(List<String> idList) { return Optional.of(true); }
            @Override
            public List<Document> similaritySearch(String query) { return List.of(); }
            @Override
            public List<Document> similaritySearch(SearchRequest request) { return List.of(); }
        };
    }
}
