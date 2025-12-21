package com.healthcare.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity
@Table(name="persons")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Person {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable=false)
  private String fullName;

  @Column(nullable=false, unique=true)
  private String email;

  @Column(nullable=false)
  private String password; // later hash it

  // Person -> Village (Location relationship)
  @ManyToOne
  @JoinColumn(name="village_id")
  private Village village;

  // One-to-One
  @OneToOne(mappedBy = "person", cascade = CascadeType.ALL, orphanRemoval = true)
  private PersonProfile profile;

  // Many-to-Many roles
  @ManyToMany
  @JoinTable(
    name="person_roles",
    joinColumns = @JoinColumn(name="person_id"),
    inverseJoinColumns = @JoinColumn(name="role_id")
  )
  private Set<Role> roles = new HashSet<>();
}
