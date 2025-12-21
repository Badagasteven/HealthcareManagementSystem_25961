package com.healthcare.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="hospitals")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Hospital {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String province;
    private String district;
    private String category;
}
