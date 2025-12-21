package com.healthcare.repository;

import com.healthcare.model.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.List;

// ========== PRESCRIPTION REPOSITORY ==========
@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    
    // Find by medical record
    List<Prescription> findByMedicalRecordId(Long medicalRecordId);
    
    // Find by medication
    List<Prescription> findByMedicationNameContainingIgnoreCase(String medicationName);
    
    // existsBy queries
    boolean existsByMedicalRecordId(Long medicalRecordId);
    
    // Sorting
    List<Prescription> findByMedicalRecordIdOrderByMedicationNameAsc(Long medicalRecordId);
}