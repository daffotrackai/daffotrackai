package com.metamorphx.daffotrackai.dto;

import java.time.LocalDateTime;

public record ChatMessageResponse(
        Long id,
        String sender,
        String text,
        String attachmentsJson,
        LocalDateTime createdAt
) {
}
