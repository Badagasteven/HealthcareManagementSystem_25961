package com.healthcare.repository;

import com.healthcare.model.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

// ========== MEDICAL RECORD REPOSITORY ==========
@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    
    // Find by patient
    List<MedicalRecord> findByPatientId(Long patientId);
    
    // Find by doctor
    List<MedicalRecord> findByDoctorId(Long doctorId);
    
    // Date queries
    List<MedicalRecord> findByTreatmentDateBetween(LocalDate startDate, LocalDate endDate);
    List<MedicalRecord> findByPatientIdAndTreatmentDateBetween(
        Long patientId, LocalDate startDate, LocalDate endDate
    );
    
    // existsBy queries
    boolean existsByPatientIdAndDoctorId(Long patientId, Long doctorId);
    
    // Sorting
    List<MedicalRecord> findByPatientIdOrderByTreatmentDateDesc(Long patientId);
    List<MedicalRecord> findAllByOrderByTreatmentDateDesc();
    
    // Pagination
    Page<MedicalRecord> findByPatientId(Long patientId, Pageable pageable);
    Page<MedicalRecord> findByDoctorId(Long doctorId, Pageable pageable);
}
