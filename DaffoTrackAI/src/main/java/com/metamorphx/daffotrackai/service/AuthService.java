package com.metamorphx.daffotrackai.service;

import com.metamorphx.daffotrackai.dto.AuthRequest;
import com.metamorphx.daffotrackai.dto.AuthResponse;
import com.metamorphx.daffotrackai.model.StudentProfile;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final StudentProfileService studentProfileService;

    public AuthService(StudentProfileService studentProfileService) {
        this.studentProfileService = studentProfileService;
    }

    public AuthResponse login(AuthRequest request) {
        boolean guest = request.guest();
        String email = request.email() == null ? "" : request.email().trim();

        if (guest || email.isBlank()) {
            return new AuthResponse("success", "Guest session started", null, "Guest DIU Student", "221-15-XXXX", "Software Engineering", null, null, null);
        }

        StudentProfile profile = studentProfileService.loginOrThrow(email, request.password());

        return new AuthResponse(
                "success",
                "Login accepted",
                profile.getId(),
                profile.getFullName(),
                profile.getStudentId(),
                profile.getDepartment(),
                profile.getEmail(),
                profile.getId() == null ? null : "/api/users/" + profile.getId() + "/image",
                profile.getProfileImage() != null && profile.getProfileImage().length > 0 ? "true" : "false"
        );
    }
}