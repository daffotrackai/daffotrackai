package com.metamorphx.daffotrackai.repository;

import com.metamorphx.daffotrackai.model.StudentProfile;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {

    Optional<StudentProfile> findByEmailIgnoreCase(String email);

    Optional<StudentProfile> findByStudentIdIgnoreCase(String studentId);
}