package com.metamorphx.daffotrackai.service;

import com.metamorphx.daffotrackai.model.CourseCatalog;
import com.metamorphx.daffotrackai.repository.CourseCatalogRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class CatalogSeeder {

    private final CourseCatalogRepository repository;

    public CatalogSeeder(CourseCatalogRepository repository) {
        this.repository = repository;
    }

    @PostConstruct
    public void seed() {
        if (repository.count() == 0) {
            CourseCatalog c1 = new CourseCatalog();
            c1.setCode("SWE-111");
            c1.setName("Computer Fundamentals");
            c1.setCredit(3.0);

            CourseCatalog c2 = new CourseCatalog();
            c2.setCode("SWE-112");
            c2.setName("Computer Fundamentals Lab");
            c2.setCredit(1.5);

            CourseCatalog c3 = new CourseCatalog();
            c3.setCode("SWE-221");
            c3.setName("Object Oriented Programming");
            c3.setCredit(3.0);

            CourseCatalog c4 = new CourseCatalog();
            c4.setCode("SWE-222");
            c4.setName("Object Oriented Programming Lab");
            c4.setCredit(1.5);

            repository.saveAll(List.of(c1, c2, c3, c4));
        }
    }
}
