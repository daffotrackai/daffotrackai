package com.metamorphx.daffotrackai.dto;

public record CourseRecordRequest(
        String code,
        String title,
        double credit,
        double midtermMarks,
        double quizMarks,
        double assignmentMarks,
        double attendanceMarks,
        double finalMarks,
        double attendancePercent
) {
}
