package com.healthcare.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="services")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Service {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    private Double priceRwf;
}
