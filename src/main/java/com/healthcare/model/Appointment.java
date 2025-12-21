package com.healthcare.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name="appointments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Appointment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="patient_id")
    private Person patient;

    @ManyToOne
    @JoinColumn(name="doctor_id")
    private Person doctor;

    private LocalDate date;
    private LocalTime time;
    private String status; // pending/confirmed/cancelled
    
    private String hospitalId;
    private String hospitalName;
    private String insurance;
    private String serviceId;
    private String serviceName;
}
