package com.healthcare.repository;

import com.healthcare.model.Person;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.*;

public interface PersonRepository extends JpaRepository<Person, Long> {
  Optional<Person> findByEmail(String email);
  boolean existsByEmail(String email);

  // Pagination + sorting
  Page<Person> findByFullNameContainingIgnoreCase(String name, Pageable pageable);

  // Derived query through location hierarchy:
  Page<Person> findByVillage_Cell_Sector_District_Province_Code(String code, Pageable pageable);
  Page<Person> findByVillage_Cell_Sector_District_Province_NameIgnoreCase(String name, Pageable pageable);

  // Custom query version (optional but good for midterm)
  @Query("""
    SELECT p FROM Person p
    WHERE LOWER(p.village.cell.sector.district.province.name) = LOWER(:provinceName)
  """)
  Page<Person> usersInProvince(@Param("provinceName") String provinceName, Pageable pageable);
}
