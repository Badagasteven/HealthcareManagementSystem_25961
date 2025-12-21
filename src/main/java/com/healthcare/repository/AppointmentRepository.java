package com.healthcare.repository;

import com.healthcare.model.Appointment;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
  Page<Appointment> findByPatient_Id(Long patientId, Pageable pageable);
  Page<Appointment> findByDoctor_Id(Long doctorId, Pageable pageable);
}
