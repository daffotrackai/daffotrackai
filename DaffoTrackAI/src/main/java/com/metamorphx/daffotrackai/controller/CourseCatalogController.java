package com.metamorphx.daffotrackai.controller;

import com.metamorphx.daffotrackai.model.CourseCatalog;
import com.metamorphx.daffotrackai.repository.CourseCatalogRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/catalog")
public class CourseCatalogController {

    private final CourseCatalogRepository repository;

    public CourseCatalogController(CourseCatalogRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<CourseCatalog> getCatalog() {
        return repository.findAllByOrderByCodeAsc();
    }
}
