package com.metamorphx.daffotrackai.dto;

public record DashboardSummaryResponse(
        String status,
        String studentName,
        String studentId,
        String department,
        double cgpa,
        double completedCredits,
        double totalCredits,
        double attendance,
        int backlogs,
        String waiverStatus,
        String syncStatus
) {
}