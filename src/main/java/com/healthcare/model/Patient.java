package com.healthcare.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patient {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // One-to-One relationship with Person
    @OneToOne
    @JoinColumn(name = "person_id", nullable = false, unique = true)
    private Person person;
    
    @Column(nullable = false)
    private String bloodType;
    
    @Column(columnDefinition = "TEXT")
    private String allergies;
    
    @Column(nullable = false)
    private String emergencyContact;
    
    @Column(nullable = false)
    private LocalDate registrationDate;
    
    // One-to-Many relationship with Appointment
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    private List<Appointment> appointments;
    
    // One-to-Many relationship with MedicalRecord
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    private List<MedicalRecord> medicalRecords;
}