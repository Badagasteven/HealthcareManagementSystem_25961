package com.healthcare.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="villages")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Village {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable=false)
  private String name;

  @ManyToOne(optional=false)
  @JoinColumn(name="cell_id")
  private Cell cell;
}
