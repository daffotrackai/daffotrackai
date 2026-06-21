package com.metamorphx.daffotrackai.dto;

public record FileExtractionResponse(
        String status,
        String fileName,
        String contentType,
        long size,
        String extractedText
) {
}
