package com.metamorphx.daffotrackai.controller;

import com.metamorphx.daffotrackai.dto.ProfileResponse;
import com.metamorphx.daffotrackai.dto.ProfileUpdateRequest;
import com.metamorphx.daffotrackai.dto.RegisterResponse;
import com.metamorphx.daffotrackai.service.StudentProfileService;
import java.util.Map;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
public class StudentProfileController {

    private final StudentProfileService studentProfileService;

    public StudentProfileController(StudentProfileService studentProfileService) {
        this.studentProfileService = studentProfileService;
    }

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public RegisterResponse register(
            @RequestParam String fullName,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String studentId,
            @RequestParam String department,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) String sessionYear,
            @RequestParam(required = false) String semester,
            @RequestParam(required = false) String dateOfBirth,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String guardianName,
            @RequestParam(required = false) String bloodGroup,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String nationality,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage
    ) {
        return studentProfileService.register(
                fullName,
                email,
                password,
                studentId,
                department,
                phone,
                sessionYear,
                semester,
                dateOfBirth,
                address,
                guardianName,
                bloodGroup,
                gender,
                nationality,
                profileImage
        );
    }

    @GetMapping("/{id}")
    public ProfileResponse getProfile(@PathVariable Long id) {
        return studentProfileService.getProfile(id);
    }

    @PutMapping("/{id}")
    public ProfileResponse updateProfile(@PathVariable Long id, @RequestBody ProfileUpdateRequest request) {
        return studentProfileService.updateProfile(id, request);
    }

    @GetMapping("/by-email")
    public ProfileResponse getProfileByEmail(@RequestParam String email) {
        return studentProfileService.getProfileByEmail(email);
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getProfileImage(@PathVariable Long id) {
        byte[] imageBytes = studentProfileService.getProfileImage(id);
        var profile = studentProfileService.getRequiredProfile(id);
        String contentType = profile.getProfileImageContentType();

        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "no-store")
                .contentType(contentType == null ? MediaType.APPLICATION_OCTET_STREAM : MediaType.parseMediaType(contentType))
                .body(imageBytes);
    }

    @PutMapping(value = "/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProfileResponse updateProfileImage(@PathVariable Long id, @RequestParam("profileImage") MultipartFile profileImage) {
        return studentProfileService.updateProfileImage(id, profileImage);
    }

    @GetMapping("/me")
    public Map<String, String> meHelp() {
        return Map.of(
                "status", "info",
                "message", "Use /api/users/{id} or /api/users/by-email?email=... to fetch profile details"
        );
    }
}
