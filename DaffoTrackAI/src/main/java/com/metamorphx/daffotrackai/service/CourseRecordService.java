package com.metamorphx.daffotrackai.service;

import com.metamorphx.daffotrackai.dto.CourseRecordRequest;
import com.metamorphx.daffotrackai.dto.CourseRecordResponse;
import com.metamorphx.daffotrackai.model.CourseRecord;
import com.metamorphx.daffotrackai.model.StudentProfile;
import com.metamorphx.daffotrackai.repository.CourseRecordRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CourseRecordService {

    private final CourseRecordRepository courseRecordRepository;
    private final StudentProfileService studentProfileService;

    public CourseRecordService(CourseRecordRepository courseRecordRepository, StudentProfileService studentProfileService) {
        this.courseRecordRepository = courseRecordRepository;
        this.studentProfileService = studentProfileService;
    }

    @Transactional(readOnly = true)
    public List<CourseRecordResponse> getCourses(Long userId) {
        return courseRecordRepository.findByStudentProfileIdOrderByCodeAsc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public CourseRecordResponse createCourse(Long userId, CourseRecordRequest request) {
        StudentProfile studentProfile = studentProfileService.getRequiredProfile(userId);
        CourseRecord course = new CourseRecord();
        course.setStudentProfile(studentProfile);
        applyRequest(course, request);
        return toResponse(courseRecordRepository.save(course));
    }

    @Transactional
    public CourseRecordResponse updateCourse(Long userId, Long courseId, CourseRecordRequest request) {
        CourseRecord course = getOwnedCourse(userId, courseId);
        applyRequest(course, request);
        return toResponse(courseRecordRepository.save(course));
    }

    @Transactional
    public void deleteCourse(Long userId, Long courseId) {
        CourseRecord course = getOwnedCourse(userId, courseId);
        courseRecordRepository.delete(course);
    }

    @Transactional(readOnly = true)
    public List<CourseRecord> getCourseEntities(Long userId) {
        return courseRecordRepository.findByStudentProfileIdOrderByCodeAsc(userId);
    }

    private CourseRecord getOwnedCourse(Long userId, Long courseId) {
        CourseRecord course = courseRecordRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));
        if (!course.getStudentProfile().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Course does not belong to this user");
        }
        return course;
    }

    private void applyRequest(CourseRecord course, CourseRecordRequest request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Course payload is required");
        }

        course.setCode(required(request.code(), "Course code is required"));
        course.setTitle(required(request.title(), "Course title is required"));
        course.setCredit(clamp(request.credit(), 0.5, 6));
        course.setSemesterName(emptyToNull(request.semesterName()));
        course.setMidtermMarks(clamp(request.midtermMarks(), 0, 25));
        course.setQuizMarks(clamp(request.quizMarks(), 0, 15));
        course.setAssignmentMarks(clamp(request.assignmentMarks(), 0, 10));
        course.setAttendanceMarks(clamp(request.attendanceMarks(), 0, 10));
        course.setFinalMarks(clamp(request.finalMarks(), 0, 40));
        course.setAttendancePercent(clamp(request.attendancePercent(), 0, 100));
        course.setClassTestMarks(clamp(request.classTestMarks(), 0, 15));
        course.setPresentationMarks(clamp(request.presentationMarks(), 0, 10));
        course.setLabPerformanceMarks(clamp(request.labPerformanceMarks(), 0, 30));
        course.setLabReportMarks(clamp(request.labReportMarks(), 0, 30));
    }

    private CourseRecordResponse toResponse(CourseRecord course) {
        double totalMarks = totalMarks(course);
        GradeCalculator.GradeResult grade = GradeCalculator.fromMarks(totalMarks);
        return new CourseRecordResponse(
                course.getId(),
                course.getStudentProfile().getId(),
                course.getCode(),
                course.getTitle(),
                course.getCredit(),
                course.getSemesterName(),
                course.getMidtermMarks(),
                course.getQuizMarks(),
                course.getAssignmentMarks(),
                course.getAttendanceMarks(),
                course.getFinalMarks(),
                course.getAttendancePercent(),
                course.getClassTestMarks(),
                course.getPresentationMarks(),
                course.getLabPerformanceMarks(),
                course.getLabReportMarks(),
                totalMarks,
                grade.letter(),
                grade.point(),
                grade.status(),
                course.getCreatedAt(),
                course.getUpdatedAt()
        );
    }

    public static double totalMarks(CourseRecord course) {
        if (course.getCredit() == 3.0) {
            return course.getMidtermMarks()
                    + course.getQuizMarks()
                    + course.getClassTestMarks()
                    + course.getAssignmentMarks()
                    + course.getAttendanceMarks()
                    + course.getPresentationMarks()
                    + course.getFinalMarks();
        } else if (course.getCredit() == 1.5) {
            return course.getLabPerformanceMarks()
                    + course.getLabReportMarks()
                    + course.getAttendanceMarks()
                    + course.getFinalMarks();
        }

        // Fallback for other credit types
        return course.getMidtermMarks()
                + course.getQuizMarks()
                + course.getAssignmentMarks()
                + course.getAttendanceMarks()
                + course.getFinalMarks();
    }

    private String required(String value, String errorMessage) {
        if (!StringUtils.hasText(value)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, errorMessage);
        }
        return value.trim();
    }

    private String emptyToNull(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }

    private double clamp(double value, double min, double max) {
        return Math.max(min, Math.min(max, value));
    }
}
