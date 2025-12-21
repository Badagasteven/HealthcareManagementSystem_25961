package com.healthcare.repository;

import com.healthcare.model.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;
// ========== DOCTOR REPOSITORY ==========
@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    
    // Find by specialization
    List<Doctor> findBySpecialization(String specialization);
    
    // Find by hospital
    List<Doctor> findByHospitalId(Long hospitalId);
    List<Doctor> findByHospitalName(String hospitalName);
    
    // Find by availability
    List<Doctor> findByAvailabilityStatus(Boolean availabilityStatus);
    
    // existsBy queries
    boolean existsByLicenseNumber(String licenseNumber);
    boolean existsByPersonId(Long personId);
    
    // Find by license
    Optional<Doctor> findByLicenseNumber(String licenseNumber);
    
    // Find by experience
    List<Doctor> findByYearsOfExperienceGreaterThan(Integer years);
    
    // Sorting
    List<Doctor> findBySpecializationOrderByYearsOfExperienceDesc(String specialization);
    List<Doctor> findAllByOrderByYearsOfExperienceDesc();
    
    // Pagination
    Page<Doctor> findBySpecialization(String specialization, Pageable pageable);
    Page<Doctor> findByAvailabilityStatus(Boolean status, Pageable pageable);
}
