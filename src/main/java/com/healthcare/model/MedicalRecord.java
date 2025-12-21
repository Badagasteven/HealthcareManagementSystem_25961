package com.healthcare.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name="medical_records")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MedicalRecord {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="patient_id")
    private Person patient;

    @ManyToOne
    @JoinColumn(name="doctor_id")
    private Person doctor;

    private String diagnosis;
    private String notes;
    private LocalDate date;
    private boolean reviewed;
}
