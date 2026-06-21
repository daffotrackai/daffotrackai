package com.metamorphx.daffotrackai.service;

import com.metamorphx.daffotrackai.dto.DashboardSummaryResponse;
import com.metamorphx.daffotrackai.model.CourseRecord;
import com.metamorphx.daffotrackai.model.StudentProfile;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private static final double TOTAL_DEGREE_CREDITS = 139.0;

    private final CourseRecordService courseRecordService;
    private final StudentProfileService studentProfileService;

    public DashboardService(CourseRecordService courseRecordService, StudentProfileService studentProfileService) {
        this.courseRecordService = courseRecordService;
        this.studentProfileService = studentProfileService;
    }

    public DashboardSummaryResponse getSummary(Long userId) {
        if (userId == null) {
            return guestSummary();
        }

        StudentProfile profile = studentProfileService.getRequiredProfile(userId);
        List<CourseRecord> courses = courseRecordService.getCourseEntities(userId);

        if (courses.isEmpty()) {
            return new DashboardSummaryResponse(
                    "success",
                    profile.getFullName(),
                    profile.getStudentId(),
                    profile.getDepartment(),
                    0.0,
                    0.0,
                    TOTAL_DEGREE_CREDITS,
                    0.0,
                    0,
                    "Add course data",
                    "DB SYNC ACTIVE"
            );
        }

        double completedCredits = courses.stream().mapToDouble(CourseRecord::getCredit).sum();
        double weightedGradePoints = courses.stream()
                .mapToDouble(course -> GradeCalculator.fromMarks(CourseRecordService.totalMarks(course)).point() * course.getCredit())
                .sum();
        double cgpa = completedCredits == 0 ? 0 : weightedGradePoints / completedCredits;
        double attendance = courses.stream().mapToDouble(CourseRecord::getAttendancePercent).average().orElse(0);
        int backlogs = (int) courses.stream()
                .filter(course -> GradeCalculator.fromMarks(CourseRecordService.totalMarks(course)).point() == 0)
                .count();
        String waiverStatus = waiverStatus(cgpa, backlogs);

        return new DashboardSummaryResponse(
                "success",
                profile.getFullName(),
                profile.getStudentId(),
                profile.getDepartment(),
                round(cgpa),
                round(completedCredits),
                TOTAL_DEGREE_CREDITS,
                round(attendance),
                backlogs,
                waiverStatus,
                "DB SYNC ACTIVE"
        );
    }

    private DashboardSummaryResponse guestSummary() {
        return new DashboardSummaryResponse(
                "success",
                "Guest DIU Student",
                "221-15-XXXX",
                "Software Engineering",
                0.0,
                0.0,
                TOTAL_DEGREE_CREDITS,
                0.0,
                0,
                "Login to sync DB",
                "GUEST MODE"
        );
    }

    private String waiverStatus(double cgpa, int backlogs) {
        if (backlogs > 0 || cgpa < 3.0) return "Waiver at risk";
        if (cgpa >= 4.0) return "100% Waiver";
        if (cgpa >= 3.9) return "60% Waiver";
        if (cgpa >= 3.8) return "40% Waiver";
        return "Waiver safe";
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
