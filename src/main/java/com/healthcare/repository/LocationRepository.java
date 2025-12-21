package com.healthcare.repository;

import com.healthcare.model.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;


import java.util.List;


// ========== LOCATION REPOSITORY ==========
@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    
    // Find by province
    List<Location> findByProvinceCode(String provinceCode);
    List<Location> findByProvinceName(String provinceName);
    
    // Find by district
    List<Location> findByDistrictName(String districtName);
    
    // existsBy queries
    boolean existsByProvinceCodeAndDistrictCodeAndSectorCodeAndCellCodeAndVillageName(
        String provinceCode, String districtCode, String sectorCode, 
        String cellCode, String villageName
    );
    
    // Sorting
    List<Location> findAllByOrderByProvinceNameAsc();
    
    // Pagination
    Page<Location> findByProvinceName(String provinceName, Pageable pageable);

    // Administrative truncate: clears table and resets identity; cascades to dependents
    @Modifying
    @Query(value = "TRUNCATE TABLE locations RESTART IDENTITY CASCADE", nativeQuery = true)
    void truncateAll();
}






