package com.store.Store.controllers;

import com.store.Store.models.Category;
import com.store.Store.models.Product;
import com.store.Store.models.ProductDto;
import com.store.Store.repositories.CategoryRepository;
import com.store.Store.repositories.ProductsRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import java.util.List;

@Controller
@RequestMapping("/products")
public class ProductsController {
    @Autowired
    private ProductsRepository repo;

    @GetMapping({"", "/"})
    public String showProductsList(Model model){
        List<Product> products = repo.findAll();
        model.addAttribute("products", products);
        return "products/index";
    }

    @GetMapping({"/create"})
    public String showCreatePage(Model model){
        ProductDto productDto = new ProductDto();
        model.addAttribute("productDto", productDto);
        return "products/CreateProduct";
    }

    @Autowired
    private CategoryRepository categoryRepo;

    @PostMapping({"/create"})
    public String createProduct(
        @Valid @ModelAttribute ProductDto productDto,
        BindingResult result)
    {
        if (productDto.getImageFile().isEmpty()){
            result.addError(new FieldError("productDto", "imageFile", "Image is required"));
        }

        if (result.hasErrors()){
            return "products/CreateProduct";
        }

        Category category = categoryRepo.findById(productDto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        MultipartFile image = productDto.getImageFile();
        Date createdAt = new Date();
        String storageFileName = createdAt.getTime() + "_" + image.getOriginalFilename();

        try{
            String uploadDir = "public/images/";
             Path uploadPath = Paths.get(uploadDir);

            if (!Files.exists(uploadPath)){
                Files.createDirectories(uploadPath);
            }

            try (InputStream inputStream = image.getInputStream()){
                Files.copy(inputStream, Paths.get(uploadDir + storageFileName),
                        StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (Exception ex){
            System.out.println("Exception: " + ex.getMessage());
        }

        Product product = new Product();
        product.setName(productDto.getName());
        product.setBrand(productDto.getBrand());
        product.setCategory(category);
        product.setPrice(productDto.getPrice());
        product.setDescription(productDto.getDescription());
        product.setCreatedAt(createdAt);
        product.setImageFileName(storageFileName);

        repo.save(product);

        return "redirect:/products";
    }

    @GetMapping("/edit")
    public String showEditPage(
            Model model,
            @RequestParam int id
    ){
        try{

            Product product = repo.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
            model.addAttribute("product", product);

            ProductDto productDto = new ProductDto();
            productDto.setName(product.getName());
            productDto.setBrand(product.getBrand());
            // Populate categoryId for the dropdown
            if (product.getCategory() != null) {
                productDto.setCategoryId(product.getCategory().getId());
            }
            productDto.setPrice(product.getPrice());
            productDto.setDescription(product.getDescription());

            model.addAttribute("productDto", productDto);

            // Also add all categories for the dropdown
            List<Category> categories = categoryRepo.findAll();
            model.addAttribute("categories", categories);

        }catch (Exception ex){
            System.out.println("Exception: " + ex.getMessage());
            return "redirect:/products";
        }
        return "products/EditProducts";
    }

    @PostMapping("/edit")
    public String updateProduct(
            Model model,
            @RequestParam int id,
            @Valid @ModelAttribute ProductDto productDto,
            BindingResult result
    ){
        try {
            Product product = repo.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
            model.addAttribute("product", product);

            Category category = categoryRepo.findById(productDto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));

            if (result.hasErrors()){
                return "products/EditProducts";
            }

            if (!productDto.getImageFile().isEmpty()){
                //delete old image
                String uploadDir = "public/images/";
                Path oldImagePath = Paths.get(uploadDir + product.getImageFileName());

                try {
                    Files.delete(oldImagePath);
                } catch (Exception e) {
                    System.out.println("Exception: " + e.getMessage());
                }

//                save new image
                MultipartFile image = productDto.getImageFile();
                Date createdAt = new Date();
                String storageFileName = createdAt.getTime() + "_" + image.getOriginalFilename();

                try (InputStream inputStream = image.getInputStream()) {
                    Files.copy(inputStream, Paths.get(uploadDir + storageFileName),
                            StandardCopyOption.REPLACE_EXISTING);
                }
                product.setImageFileName(storageFileName);
            }
            product.setName(productDto.getName());
            product.setBrand(productDto.getBrand());
            product.setCategory(category);
            product.setPrice(productDto.getPrice());
            product.setDescription(productDto.getDescription());

            repo.save(product);

        } catch (Exception e) {
            System.out.println("Exception: " + e.getMessage());
        }

        return "redirect:/products";
    }

    @GetMapping("/delete")
    public String deleteProduct(
            @RequestParam int id
    ){
        try {
            Product product = repo.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));

            // delete the image
            Path imagePath = Paths.get("public/images/" + product.getImageFileName());

            try {
                Files.delete(imagePath);
            }catch (Exception e){
                System.out.println("Exception: " + e.getMessage());
            }

            // delete
            repo.delete(product);
        }catch(Exception e){
            System.out.println("Exception: " + e.getMessage());
        }
        return "redirect:/products";
    }
}
