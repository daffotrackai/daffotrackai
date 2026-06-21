package com.metamorphx.daffotrackai.repository;

import com.metamorphx.daffotrackai.model.CourseRecord;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRecordRepository extends JpaRepository<CourseRecord, Long> {

    List<CourseRecord> findByStudentProfileIdOrderByCodeAsc(Long studentProfileId);

    long countByStudentProfileId(Long studentProfileId);
}
