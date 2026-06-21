package com.metamorphx.daffotrackai.dto;

public record ChatConversationRequest(
        Long userId,
        String studentId,
        String title
) {
}
