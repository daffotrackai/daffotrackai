package com.metamorphx.daffotrackai.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "course_records")
public class CourseRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_profile_id", nullable = false)
    private StudentProfile studentProfile;

    @Column(nullable = false)
    private String code;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private double credit;

    private double midtermMarks;
    private double quizMarks;
    private double assignmentMarks;
    private double attendanceMarks;
    private double finalMarks;
    private double attendancePercent;

    private double classTestMarks;
    private double presentationMarks;
    private double labPerformanceMarks;
    private double labReportMarks;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public StudentProfile getStudentProfile() {
        return studentProfile;
    }

    public void setStudentProfile(StudentProfile studentProfile) {
        this.studentProfile = studentProfile;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public double getCredit() {
        return credit;
    }

    public void setCredit(double credit) {
        this.credit = credit;
    }

    public double getMidtermMarks() {
        return midtermMarks;
    }

    public void setMidtermMarks(double midtermMarks) {
        this.midtermMarks = midtermMarks;
    }

    public double getQuizMarks() {
        return quizMarks;
    }

    public void setQuizMarks(double quizMarks) {
        this.quizMarks = quizMarks;
    }

    public double getAssignmentMarks() {
        return assignmentMarks;
    }

    public void setAssignmentMarks(double assignmentMarks) {
        this.assignmentMarks = assignmentMarks;
    }

    public double getAttendanceMarks() {
        return attendanceMarks;
    }

    public void setAttendanceMarks(double attendanceMarks) {
        this.attendanceMarks = attendanceMarks;
    }

    public double getFinalMarks() {
        return finalMarks;
    }

    public void setFinalMarks(double finalMarks) {
        this.finalMarks = finalMarks;
    }

    public double getAttendancePercent() {
        return attendancePercent;
    }

    public void setAttendancePercent(double attendancePercent) {
        this.attendancePercent = attendancePercent;
    }

    public double getClassTestMarks() {
        return classTestMarks;
    }

    public void setClassTestMarks(double classTestMarks) {
        this.classTestMarks = classTestMarks;
    }

    public double getPresentationMarks() {
        return presentationMarks;
    }

    public void setPresentationMarks(double presentationMarks) {
        this.presentationMarks = presentationMarks;
    }

    public double getLabPerformanceMarks() {
        return labPerformanceMarks;
    }

    public void setLabPerformanceMarks(double labPerformanceMarks) {
        this.labPerformanceMarks = labPerformanceMarks;
    }

    public double getLabReportMarks() {
        return labReportMarks;
    }

    public void setLabReportMarks(double labReportMarks) {
        this.labReportMarks = labReportMarks;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
