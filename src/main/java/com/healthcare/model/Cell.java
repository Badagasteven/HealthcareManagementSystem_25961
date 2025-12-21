package com.healthcare.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity
@Table(name="cells")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Cell {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name="sector_id")
    private Sector sector;

    @OneToMany(mappedBy = "cell")
    private List<Village> villages = new ArrayList<>();
}
