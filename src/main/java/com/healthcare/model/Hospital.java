package com.healthcare.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "hospitals")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Hospital {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HospitalType type;
    
    @Column(nullable = false)
    private Integer capacity;
    
    @Column(nullable = false)
    private LocalDate registrationDate;
    
    // Many-to-One relationship with Location
    @ManyToOne
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;
    
    // One-to-Many relationship with Doctor
    @OneToMany(mappedBy = "hospital", cascade = CascadeType.ALL)
    private List<Doctor> doctors;
    
    public enum HospitalType {
        PUBLIC, PRIVATE, CLINIC, DISTRICT_HOSPITAL, REFERRAL_HOSPITAL
    }
}