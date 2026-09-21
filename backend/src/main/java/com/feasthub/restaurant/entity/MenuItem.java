package com.feasthub.restaurant.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "menu_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal price;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Builder.Default
    @Column(name = "is_veg")
    private Boolean isVeg = true;

    @Builder.Default
    @Column(name = "is_available")
    private Boolean isAvailable = true;

    // AI Generated Nutritional Breakdown
    @Builder.Default
    @Column(name = "calories_kcal")
    private Integer caloriesKcal = 450;

    @Builder.Default
    @Column(name = "protein_g", precision = 5, scale = 1)
    private BigDecimal proteinG = new BigDecimal("18.0");

    @Builder.Default
    @Column(name = "carbs_g", precision = 5, scale = 1)
    private BigDecimal carbsG = new BigDecimal("45.0");

    @Builder.Default
    @Column(name = "fat_g", precision = 5, scale = 1)
    private BigDecimal fatG = new BigDecimal("14.0");

    @Builder.Default
    @Column(name = "fiber_g", precision = 5, scale = 1)
    private BigDecimal fiberG = new BigDecimal("4.0");

    @Builder.Default
    @Column(length = 255)
    private String allergens = "Gluten, Dairy";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
