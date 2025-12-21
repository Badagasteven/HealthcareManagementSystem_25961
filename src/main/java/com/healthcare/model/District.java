package com.healthcare.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity
@Table(name="districts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class District {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable=false)
  private String name;

  @ManyToOne(optional=false)
  @JoinColumn(name="province_id")
  private Province province;

  @OneToMany(mappedBy = "district", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Sector> sectors = new ArrayList<>();
}
