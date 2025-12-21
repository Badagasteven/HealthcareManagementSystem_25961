package com.healthcare.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name="prescriptions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Prescription {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="patient_id")
    private Person patient;

    @ManyToOne
    @JoinColumn(name="doctor_id")
    private Person doctor;

    private String medication;
    private String dosage;
    private String frequency;
    private Integer durationDays;
    private String instructions;
    private LocalDate dateIssued;
    private String status; // active/dispensed/cancelled
}
