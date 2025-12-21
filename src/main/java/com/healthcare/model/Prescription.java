package com.healthcare.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.*;

@Entity
@Table(name="prescriptions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Prescription {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional=false)
  @JoinColumn(name="patient_id")
  private Person patient;

  @ManyToOne(optional=false)
  @JoinColumn(name="doctor_id")
  private Person doctor;

  private LocalDate issueDate;
  private String medication;
  private String dosage;
  private String status; // active/dispensed/cancelled
}
