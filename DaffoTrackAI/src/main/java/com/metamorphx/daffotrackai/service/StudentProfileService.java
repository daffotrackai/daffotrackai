package com.metamorphx.daffotrackai.service;

import com.metamorphx.daffotrackai.dto.ProfileResponse;
import com.metamorphx.daffotrackai.dto.ProfileUpdateRequest;
import com.metamorphx.daffotrackai.dto.RegisterResponse;
import com.metamorphx.daffotrackai.model.StudentProfile;
import com.metamorphx.daffotrackai.repository.StudentProfileRepository;
import java.time.LocalDate;
import java.util.Objects;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class StudentProfileService {

    private final StudentProfileRepository studentProfileRepository;

    public StudentProfileService(StudentProfileRepository studentProfileRepository) {
        this.studentProfileRepository = studentProfileRepository;
    }

    @Transactional
    public RegisterResponse register(
            String fullName,
            String email,
            String password,
            String studentId,
            String department,
            String phone,
            String sessionYear,
            String semester,
            String dateOfBirth,
            String address,
            String guardianName,
            String bloodGroup,
            String gender,
            String nationality,
            MultipartFile profileImage
    ) {
        String normalizedEmail = normalizeRequired(email, "Email is required");
        String normalizedStudentId = normalizeRequired(studentId, "Student ID is required");

        if (studentProfileRepository.findByEmailIgnoreCase(normalizedEmail).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A user with this email already exists");
        }

        if (studentProfileRepository.findByStudentIdIgnoreCase(normalizedStudentId).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A user with this student ID already exists");
        }

        StudentProfile profile = new StudentProfile();
        profile.setFullName(normalizeRequired(fullName, "Full name is required"));
        profile.setEmail(normalizedEmail);
        profile.setPassword(normalizeRequired(password, "Password is required"));
        profile.setStudentId(normalizedStudentId);
        profile.setDepartment(normalizeRequired(department, "Department is required"));
        profile.setPhone(emptyToNull(phone));
        profile.setSessionYear(emptyToNull(sessionYear));
        profile.setSemester(emptyToNull(semester));
        profile.setDateOfBirth(parseDate(dateOfBirth));
        profile.setAddress(emptyToNull(address));
        profile.setGuardianName(emptyToNull(guardianName));
        profile.setBloodGroup(emptyToNull(bloodGroup));
        profile.setGender(emptyToNull(gender));
        profile.setNationality(emptyToNull(nationality));

        if (profileImage != null && !profileImage.isEmpty()) {
            try {
                profile.setProfileImage(profileImage.getBytes());
                profile.setProfileImageContentType(profileImage.getContentType());
                profile.setProfileImageName(profileImage.getOriginalFilename());
            } catch (Exception exception) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unable to read uploaded profile image");
            }
        }

        StudentProfile saved = studentProfileRepository.save(profile);
        return toRegisterResponse(saved);
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(Long id) {
        StudentProfile profile = getRequiredProfile(id);
        return toProfileResponse(profile);
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfileByEmail(String email) {
        StudentProfile profile = studentProfileRepository.findByEmailIgnoreCase(normalizeRequired(email, "Email is required"))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return toProfileResponse(profile);
    }

    @Transactional(readOnly = true)
    public StudentProfile getRequiredProfile(Long id) {
        return studentProfileRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    @Transactional(readOnly = true)
    public StudentProfile getRequiredProfileByEmail(String email) {
        return studentProfileRepository.findByEmailIgnoreCase(normalizeRequired(email, "Email is required"))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    @Transactional
    public ProfileResponse updateProfile(Long id, ProfileUpdateRequest request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Profile payload is required");
        }

        StudentProfile profile = getRequiredProfile(id);
        String normalizedEmail = normalizeRequired(request.email(), "Email is required");
        String normalizedStudentId = normalizeRequired(request.studentId(), "Student ID is required");

        studentProfileRepository.findByEmailIgnoreCase(normalizedEmail)
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "A user with this email already exists");
                });

        studentProfileRepository.findByStudentIdIgnoreCase(normalizedStudentId)
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "A user with this student ID already exists");
                });

        profile.setFullName(normalizeRequired(request.fullName(), "Full name is required"));
        profile.setEmail(normalizedEmail);
        profile.setPassword(StringUtils.hasText(request.password()) ? request.password().trim() : profile.getPassword());
        profile.setStudentId(normalizedStudentId);
        profile.setDepartment(normalizeRequired(request.department(), "Department is required"));
        profile.setPhone(emptyToNull(request.phone()));
        profile.setSessionYear(emptyToNull(request.sessionYear()));
        profile.setSemester(emptyToNull(request.semester()));
        profile.setDateOfBirth(parseDate(request.dateOfBirth()));
        profile.setAddress(emptyToNull(request.address()));
        profile.setGuardianName(emptyToNull(request.guardianName()));
        profile.setBloodGroup(emptyToNull(request.bloodGroup()));
        profile.setGender(emptyToNull(request.gender()));
        profile.setNationality(emptyToNull(request.nationality()));

        return toProfileResponse(studentProfileRepository.save(profile));
    }

    @Transactional(readOnly = true)
    public byte[] getProfileImage(Long id) {
        StudentProfile profile = getRequiredProfile(id);
        if (profile.getProfileImage() == null || profile.getProfileImage().length == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile image not found");
        }
        return profile.getProfileImage();
    }

    @Transactional
    public ProfileResponse updateProfileImage(Long id, MultipartFile profileImage) {
        StudentProfile profile = getRequiredProfile(id);
        if (profileImage == null || profileImage.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Profile image is required");
        }

        try {
            profile.setProfileImage(profileImage.getBytes());
            profile.setProfileImageContentType(profileImage.getContentType());
            profile.setProfileImageName(profileImage.getOriginalFilename());
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unable to read uploaded profile image");
        }

        return toProfileResponse(studentProfileRepository.save(profile));
    }

    @Transactional(readOnly = true)
    public StudentProfile loginOrThrow(String email, String password) {
        StudentProfile profile = getRequiredProfileByEmail(email);
        if (!Objects.equals(profile.getPassword(), password)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }
        return profile;
    }

    private RegisterResponse toRegisterResponse(StudentProfile profile) {
        return new RegisterResponse(
                "success",
                "Registration saved successfully",
                profile.getId(),
                profile.getFullName(),
                profile.getStudentId(),
                profile.getEmail(),
                profile.getDepartment(),
                profile.getId() == null ? null : "/api/users/" + profile.getId() + "/image"
        );
    }

    private ProfileResponse toProfileResponse(StudentProfile profile) {
        return new ProfileResponse(
                profile.getId(),
                profile.getFullName(),
                profile.getEmail(),
                profile.getStudentId(),
                profile.getPassword(),
                profile.getDepartment(),
                profile.getPhone(),
                profile.getSessionYear(),
                profile.getSemester(),
                profile.getDateOfBirth(),
                profile.getAddress(),
                profile.getGuardianName(),
                profile.getBloodGroup(),
                profile.getGender(),
                profile.getNationality(),
                profile.getId() == null ? null : "/api/users/" + profile.getId() + "/image",
                profile.getProfileImage() != null && profile.getProfileImage().length > 0,
                profile.getCreatedAt(),
                profile.getUpdatedAt()
        );
    }

    private String normalizeRequired(String value, String errorMessage) {
        if (!StringUtils.hasText(value)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, errorMessage);
        }
        return value.trim();
    }

    private String emptyToNull(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }

    private LocalDate parseDate(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        try {
            return LocalDate.parse(value.trim());
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid date of birth format. Use YYYY-MM-DD.");
        }
    }
}
