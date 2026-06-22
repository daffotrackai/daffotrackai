package com.metamorphx.daffotrackai.repository;

import com.metamorphx.daffotrackai.model.CourseCatalog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseCatalogRepository extends JpaRepository<CourseCatalog, Long> {
    List<CourseCatalog> findAllByOrderByCodeAsc();
}
