package com.healthcare.repository;

import com.healthcare.model.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {
    
    // Find by location
    List<Hospital> findByLocationProvinceCode(String provinceCode);
    List<Hospital> findByLocationProvinceName(String provinceName);
    
    // Find by type
    List<Hospital> findByType(Hospital.HospitalType type);
    
    // Find by name
    List<Hospital> findByNameContainingIgnoreCase(String name);
    Optional<Hospital> findByName(String name);
    
    // existsBy queries
    boolean existsByName(String name);
    
    // Capacity queries
    List<Hospital> findByCapacityGreaterThan(Integer capacity);
    
    // Sorting
    List<Hospital> findAllByOrderByRegistrationDateDesc();
    List<Hospital> findByTypeOrderByCapacityDesc(Hospital.HospitalType type);
    
    // Pagination
    Page<Hospital> findByType(Hospital.HospitalType type, Pageable pageable);
}
