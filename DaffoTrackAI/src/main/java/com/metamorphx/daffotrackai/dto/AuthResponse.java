package com.metamorphx.daffotrackai.dto;

public record AuthResponse(
	String status,
	String message,
	Long userId,
	String studentName,
	String studentId,
	String department,
	String email,
	String profileImageUrl,
	String hasProfileImage
) {
}