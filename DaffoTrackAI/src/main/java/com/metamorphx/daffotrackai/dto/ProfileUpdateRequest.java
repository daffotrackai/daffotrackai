package com.metamorphx.daffotrackai.dto;

public record ProfileUpdateRequest(
        String fullName,
        String email,
        String password,
        String studentId,
        String department,
        String phone,
        String sessionYear,
        String semester,
        String dateOfBirth,
        String admissionDate,
        String address,
        String guardianName,
        String bloodGroup,
        String gender,
        String nationality
) {
}
