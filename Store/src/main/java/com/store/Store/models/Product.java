package com.store.Store.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "products")
@Getter @Setter @NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String brand;
    private BigDecimal price;

    @Column(columnDefinition = "TEXT")
    private String description;

    private int stockQuantity;

    private String imageFileName;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt = new Date();

    // --- NEW: Foreign Key to Category ---
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
}
