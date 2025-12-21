package com.healthcare.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // One-to-One relationship with Person
    @OneToOne
    @JoinColumn(name = "person_id", nullable = false, unique = true)
    private Person person;
    
    @Column(nullable = false)
    private String specialization;
    
    @Column(nullable = false, unique = true)
    private String licenseNumber;
    
    @Column(nullable = false)
    private Integer yearsOfExperience;
    
    @Column(nullable = false)
    private Boolean availabilityStatus;
    
    // Many-to-One relationship with Hospital
    @ManyToOne
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;
    
    // One-to-Many relationship with Appointment
    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL)
    private List<Appointment> appointments;
    
    // One-to-Many relationship with MedicalRecord
    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL)
    private List<MedicalRecord> medicalRecords;
}