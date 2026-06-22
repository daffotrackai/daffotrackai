package com.metamorphx.daffotrackai.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ProfileResponse(
        Long userId,
        String fullName,
        String email,
        String studentId,
        String password,
        String department,
        String phone,
        String sessionYear,
        String semester,
        LocalDate dateOfBirth,
        LocalDate admissionDate,
        String address,
        String guardianName,
        String bloodGroup,
        String gender,
        String nationality,
        String profileImageUrl,
        boolean hasProfileImage,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}