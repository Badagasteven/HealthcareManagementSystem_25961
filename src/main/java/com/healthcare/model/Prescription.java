package com.healthcare.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "prescriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Prescription {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Many-to-One relationship with MedicalRecord
    @ManyToOne
    @JoinColumn(name = "medical_record_id", nullable = false)
    private MedicalRecord medicalRecord;
    
    @Column(nullable = false)
    private String medicationName;
    
    @Column(nullable = false)
    private String dosage;
    
    @Column(nullable = false)
    private String frequency;
    
    @Column(nullable = false)
    private String duration;
    
    @Column(columnDefinition = "TEXT")
    private String instructions;
}