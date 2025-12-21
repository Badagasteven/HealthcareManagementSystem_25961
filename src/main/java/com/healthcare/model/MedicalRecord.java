package com.healthcare.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.*;

@Entity
@Table(name="medical_records")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MedicalRecord {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional=false)
  @JoinColumn(name="patient_id")
  private Person patient;

  private LocalDate recordDate;
  private String diagnosis;

  @Column(length = 2000)
  private String notes;
}
