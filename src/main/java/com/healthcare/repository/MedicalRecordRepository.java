package com.healthcare.repository;

import com.healthcare.model.MedicalRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long>, JpaSpecificationExecutor<MedicalRecord> {
    Page<MedicalRecord> findByPatientId(Long patientId, Pageable pageable);
    Page<MedicalRecord> findByDoctorId(Long doctorId, Pageable pageable);
}
