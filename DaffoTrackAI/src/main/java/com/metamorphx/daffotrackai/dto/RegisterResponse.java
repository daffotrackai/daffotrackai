package com.metamorphx.daffotrackai.dto;

public record RegisterResponse(
        String status,
        String message,
        Long userId,
        String fullName,
        String studentId,
        String email,
        String department,
        String profileImageUrl
) {
}