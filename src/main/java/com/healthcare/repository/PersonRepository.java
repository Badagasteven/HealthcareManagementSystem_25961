package com.healthcare.repository;

import com.healthcare.model.Person;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
    
    // REQUIRED: Find users by province code
    List<Person> findByLocationProvinceCode(String provinceCode);
    
    // REQUIRED: Find users by province name
    List<Person> findByLocationProvinceName(String provinceName);
    
    // Find by district
    List<Person> findByLocationDistrictName(String districtName);
    
    // Find by role
    List<Person> findByRole(Person.Role role);
    
    // existsBy queries
    boolean existsByEmail(String email);
    boolean existsByNationalId(String nationalId);
    boolean existsByPhone(String phone);
    
    // findBy queries
    Optional<Person> findByEmail(String email);
    Optional<Person> findByNationalId(String nationalId);
    
    // Search by name
    List<Person> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
        String firstName, String lastName
    );
    
    // Sorting queries
    List<Person> findAllByOrderByFirstNameAsc();
    List<Person> findByRoleOrderByLastNameAsc(Person.Role role);
    
    // Pagination support
    Page<Person> findByRole(Person.Role role, Pageable pageable);
    Page<Person> findByLocationProvinceName(String provinceName, Pageable pageable);
}