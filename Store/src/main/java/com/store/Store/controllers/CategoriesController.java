package com.store.Store.controllers;

import com.store.Store.models.Category;
import com.store.Store.models.CategoryDto;
import com.store.Store.services.CategoryRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/categories")
public class CategoriesController {
    @Autowired
    private CategoryRepository repo;

    @GetMapping({"", "/"})
    public String showCategoriesList(Model model){
        List<Category> categories = repo.findAll();
        model.addAttribute("categories", categories);
        return "categories/index";
    }

    @GetMapping({"/create"})
    public String showCreatePage(Model model){
        CategoryDto categoryDto = new CategoryDto();
        model.addAttribute("categoryDto", categoryDto);
        return "categories/AddCategory";
    }

    @PostMapping({"/create"})
    public String createCategory(
            @Valid @ModelAttribute CategoryDto categoryDto,
            BindingResult result
    ){
        if (result.hasErrors()) {
            return "categories/AddCategory";
        }

        Category category = new Category();
        category.setName(categoryDto.getName());

        repo.save(category);

        return "redirect:/categories";
    }

    @GetMapping("/delete")
    public String deleteCategory(
            @RequestParam Long id
    ){
        try {
            Category category = repo.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
            repo.delete(category);
        }catch (Exception e){
            System.out.println("Exception: " + e.getMessage());
        }
        return "redirect:/categories";
    }
}
