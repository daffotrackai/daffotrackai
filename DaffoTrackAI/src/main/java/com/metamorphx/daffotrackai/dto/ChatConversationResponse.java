package com.metamorphx.daffotrackai.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ChatConversationResponse(
        Long id,
        String ownerKey,
        String title,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<ChatMessageResponse> messages
) {
}
