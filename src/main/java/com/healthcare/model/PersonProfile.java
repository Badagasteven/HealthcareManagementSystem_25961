package com.healthcare.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="person_profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PersonProfile {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private Integer age;
  private String gender;
  private String phone;

  @OneToOne
  @JoinColumn(name="person_id", unique = true)
  private Person person;
}
