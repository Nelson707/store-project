package com.store.Store.controllers.api;

import com.store.Store.models.Category;
import com.store.Store.dto.CategoryDto;
import com.store.Store.repositories.CategoryRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
//@CrossOrigin(origins = "http://localhost:5173")
public class CategoryApiController {
    private final CategoryRepository repo;

    public CategoryApiController(CategoryRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Category> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody CategoryDto dto) {
        if (repo.existsByName(dto.getName())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Category already exists"));
        }

        Category category = new Category();
        category.setName(dto.getName());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(repo.save(category));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Category category = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        repo.delete(category);
        return ResponseEntity.noContent().build();
    }
}
