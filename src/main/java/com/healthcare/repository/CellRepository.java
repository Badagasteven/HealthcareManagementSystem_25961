package com.healthcare.repository;

import com.healthcare.model.Cell;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CellRepository extends JpaRepository<Cell, Long> {
}
