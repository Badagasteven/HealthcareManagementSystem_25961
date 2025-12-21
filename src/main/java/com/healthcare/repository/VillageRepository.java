package com.healthcare.repository;

import com.healthcare.model.Village;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VillageRepository extends JpaRepository<Village, Long> {
}
