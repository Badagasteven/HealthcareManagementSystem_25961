package com.healthcare.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity
@Table(name="provinces")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Province {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable=false, unique=true)
  private String code; // e.g. "KGL", "EAST"

  @Column(nullable=false, unique=true)
  private String name; // City of Kigali, Eastern Province...

  @OneToMany(mappedBy = "province", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<District> districts = new ArrayList<>();
}
