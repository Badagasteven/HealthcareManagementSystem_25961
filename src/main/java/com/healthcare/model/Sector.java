package com.healthcare.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity
@Table(name="sectors")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Sector {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable=false)
  private String name;

  @ManyToOne(optional=false)
  @JoinColumn(name="district_id")
  private District district;

  @OneToMany(mappedBy = "sector", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Cell> cells = new ArrayList<>();
}
