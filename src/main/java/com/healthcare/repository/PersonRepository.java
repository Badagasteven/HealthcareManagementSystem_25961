package com.healthcare.repository;

import com.healthcare.model.Person;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PersonRepository extends JpaRepository<Person, Long>, JpaSpecificationExecutor<Person> {
    Optional<Person> findByEmail(String email);
    
    // Case-insensitive email lookup
    @Query("SELECT p FROM Person p WHERE LOWER(p.email) = LOWER(:email)")
    Optional<Person> findByEmailIgnoreCase(@Param("email") String email);
    
    boolean existsByEmail(String email);
    long countByRoles_Name(String roleName);
    Page<Person> findByRoles_Name(String roleName, Pageable pageable);
}
