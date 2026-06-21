package com.metamorphx.daffotrackai.dto;

import java.time.LocalDateTime;

public record CourseRecordResponse(
        Long id,
        Long userId,
        String code,
        String title,
        double credit,
        double midtermMarks,
        double quizMarks,
        double assignmentMarks,
        double attendanceMarks,
        double finalMarks,
        double attendancePercent,
        double totalMarks,
        String grade,
        double gradePoint,
        String status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
