package com.store.Store.models;

import jakarta.validation.constraints.NotEmpty;

public class CategoryDto {

    @NotEmpty(message = "Category name is required")
    private String name;

    // ===== Getters and Setters =====
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
