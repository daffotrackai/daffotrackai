package com.metamorphx.daffotrackai.controller;

import com.metamorphx.daffotrackai.dto.CourseRecordRequest;
import com.metamorphx.daffotrackai.dto.CourseRecordResponse;
import com.metamorphx.daffotrackai.service.CourseRecordService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/courses")
public class CourseRecordController {

    private final CourseRecordService courseRecordService;

    public CourseRecordController(CourseRecordService courseRecordService) {
        this.courseRecordService = courseRecordService;
    }

    @GetMapping
    public List<CourseRecordResponse> getCourses(@RequestParam Long userId) {
        return courseRecordService.getCourses(userId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CourseRecordResponse createCourse(@RequestParam Long userId, @RequestBody CourseRecordRequest request) {
        return courseRecordService.createCourse(userId, request);
    }

    @PutMapping("/{courseId}")
    public CourseRecordResponse updateCourse(
            @RequestParam Long userId,
            @PathVariable Long courseId,
            @RequestBody CourseRecordRequest request
    ) {
        return courseRecordService.updateCourse(userId, courseId, request);
    }

    @DeleteMapping("/{courseId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCourse(@RequestParam Long userId, @PathVariable Long courseId) {
        courseRecordService.deleteCourse(userId, courseId);
    }
}
