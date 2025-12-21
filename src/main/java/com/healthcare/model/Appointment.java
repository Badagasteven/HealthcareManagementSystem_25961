package com.healthcare.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.*;

@Entity
@Table(name="appointments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Appointment {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional=false)
  @JoinColumn(name="patient_id")
  private Person patient;

  @ManyToOne(optional=false)
  @JoinColumn(name="doctor_id")
  private Person doctor;

  private LocalDate date;
  private LocalTime time;

  private String status; // pending/confirmed/cancelled
}
