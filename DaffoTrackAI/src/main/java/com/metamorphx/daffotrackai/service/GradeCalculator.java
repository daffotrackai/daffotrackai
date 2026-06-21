package com.metamorphx.daffotrackai.service;

public final class GradeCalculator {

    private GradeCalculator() {
    }

    public static GradeResult fromMarks(double marks) {
        if (marks >= 80) return new GradeResult("A+", 4.00, "Outstanding");
        if (marks >= 75) return new GradeResult("A", 3.75, "Excellent");
        if (marks >= 70) return new GradeResult("A-", 3.50, "Very good");
        if (marks >= 65) return new GradeResult("B+", 3.25, "Good");
        if (marks >= 60) return new GradeResult("B", 3.00, "Waiver safe");
        if (marks >= 55) return new GradeResult("B-", 2.75, "Improve");
        if (marks >= 50) return new GradeResult("C+", 2.50, "Risk");
        if (marks >= 45) return new GradeResult("C", 2.25, "High risk");
        if (marks >= 40) return new GradeResult("D", 2.00, "Very high risk");
        return new GradeResult("F", 0.00, "Retake");
    }

    public record GradeResult(String letter, double point, String status) {
    }
}
