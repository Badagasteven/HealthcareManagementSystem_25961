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
  private String password;

  // Person -> Village (Location relationship)
  @ManyToOne
  @JoinColumn(name="village_id")
  private Village village;
  
  private String phone;
  private Integer age;
  private String gender;
  private String insurance;
  private String specialty;
  private String hospitalId;


  // Many-to-Many roles
  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(
    name="person_roles",
    joinColumns = @JoinColumn(name="person_id"),
    inverseJoinColumns = @JoinColumn(name="role_id")
  )
  private Set<Role> roles = new HashSet<>();
  
  private boolean mfaEnabled = false;
  private String mfaSecret;
}
