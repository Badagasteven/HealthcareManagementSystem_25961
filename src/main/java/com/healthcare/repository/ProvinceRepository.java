package com.healthcare.repository;

import com.healthcare.model.Province;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProvinceRepository extends JpaRepository<Province, Long> {
  Optional<Province> findByCode(String code);
  Optional<Province> findByNameIgnoreCase(String name);
  boolean existsByCode(String code);
  boolean existsByNameIgnoreCase(String name);
}
