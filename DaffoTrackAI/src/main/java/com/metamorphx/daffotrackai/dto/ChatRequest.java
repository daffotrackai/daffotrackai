package com.metamorphx.daffotrackai.dto;

public record ChatRequest(
        Long conversationId,
        Long userId,
        String studentId,
        String message,
        String attachmentsJson
) {
}
