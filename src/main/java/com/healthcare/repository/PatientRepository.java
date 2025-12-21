package com.healthcare.repository;

import com.healthcare.model.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

// ========== PATIENT REPOSITORY ==========
@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    
    // Find by blood type
    List<Patient> findByBloodType(String bloodType);
    
    // existsBy queries
    boolean existsByPersonId(Long personId);
    boolean existsByPersonEmail(String email);
    
    // Find by registration date
    List<Patient> findByRegistrationDateBetween(LocalDate startDate, LocalDate endDate);
    List<Patient> findByRegistrationDateAfter(LocalDate date);
    
    // Sorting
    List<Patient> findAllByOrderByRegistrationDateDesc();
    List<Patient> findByBloodTypeOrderByRegistrationDateDesc(String bloodType);
    
    // Pagination
    Page<Patient> findByBloodType(String bloodType, Pageable pageable);
}
