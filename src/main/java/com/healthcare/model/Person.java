package com.healthcare.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "persons")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Person {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String phone;
    
    @Column(nullable = false)
    private LocalDate dateOfBirth;
    
    @Column(nullable = false)
    private String gender;
    
    @Column(nullable = false, unique = true)
    private String nationalId;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    
    // Many-to-One relationship with Location
    @ManyToOne
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;
    
    // One-to-One relationship with Doctor
    @OneToOne(mappedBy = "person", cascade = CascadeType.ALL)
    private Doctor doctor;
    
    // One-to-One relationship with Patient
    @OneToOne(mappedBy = "person", cascade = CascadeType.ALL)
    private Patient patient;
    
    public enum Role {
        PATIENT, DOCTOR, ADMIN, NURSE
    }
}