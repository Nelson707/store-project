package com.store.Store.controllers.api;

import com.store.Store.models.Category;
import com.store.Store.models.Product;
import com.store.Store.dto.ProductDto;
import com.store.Store.repositories.CategoryRepository;
import com.store.Store.repositories.ProductsRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductApiController {

    private final ProductsRepository productRepo;
    private final CategoryRepository categoryRepo;

    public ProductApiController(
            ProductsRepository productRepo,
            CategoryRepository categoryRepo
    ) {
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
    }

    // GET ALL
    @GetMapping
    public List<Product> getAll() {
        return productRepo.findAll();
    }

    // GET ONE PRODUCT
    @GetMapping("/{id}")
    public Product getOne(@PathVariable Long id) {
        return productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }


    // CREATE
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(@Valid @ModelAttribute ProductDto dto) {
        Category category = categoryRepo.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        String imageFileName = saveImage(dto.getImageFile());

        Product product = new Product();
        product.setName(dto.getName());
        product.setBrand(dto.getBrand());
        product.setPrice(dto.getPrice());
        product.setDescription(dto.getDescription());
        product.setCategory(category);
        product.setStockQuantity(dto.getStockQuantity());
        product.setImageFileName(imageFileName);
        product.setCreatedAt(new Date());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(productRepo.save(product));
    }

    // UPDATE
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @Valid @ModelAttribute ProductDto dto
    ) {
        Product product = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Category category = categoryRepo.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (dto.getImageFile() != null && !dto.getImageFile().isEmpty()) {
            deleteImage(product.getImageFileName());
            String newImage = saveImage(dto.getImageFile());
            product.setImageFileName(newImage);
        }

        product.setName(dto.getName());
        product.setBrand(dto.getBrand());
        product.setPrice(dto.getPrice());
        product.setDescription(dto.getDescription());
        product.setStockQuantity(dto.getStockQuantity());
        product.setCategory(category);

        return ResponseEntity.ok(productRepo.save(product));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Product product = productRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        deleteImage(product.getImageFileName());
        productRepo.delete(product);

        return ResponseEntity.noContent().build();
    }

    // IMAGE HELPERS
    private String saveImage(MultipartFile image) {
        try {
            // Get absolute path
            String uploadDir = new File("public/images/").getAbsolutePath() + "/";
            Files.createDirectories(Paths.get(uploadDir));

            String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            Files.copy(
                    image.getInputStream(),
                    Paths.get(uploadDir + filename),
                    StandardCopyOption.REPLACE_EXISTING
            );
            return filename;
        } catch (Exception e) {
            throw new RuntimeException("Failed to save image: " + e.getMessage());
        }
    }

    private void deleteImage(String filename) {
        try {
            Files.deleteIfExists(Paths.get("public/images/" + filename));
        } catch (Exception ignored) {}
    }
}
