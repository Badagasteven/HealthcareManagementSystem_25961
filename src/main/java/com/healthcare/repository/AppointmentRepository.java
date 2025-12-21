package com.healthcare.repository;

import com.healthcare.model.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

// ========== APPOINTMENT REPOSITORY ==========
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    // Find by patient
    List<Appointment> findByPatientId(Long patientId);
    
    // Find by doctor
    List<Appointment> findByDoctorId(Long doctorId);
    
    // Find by status
    List<Appointment> findByStatus(Appointment.AppointmentStatus status);
    
    // Complex queries
    List<Appointment> findByPatientIdAndStatus(Long patientId, Appointment.AppointmentStatus status);
    List<Appointment> findByDoctorIdAndStatus(Long doctorId, Appointment.AppointmentStatus status);
    
    // Date range queries
    List<Appointment> findByAppointmentDateBetween(LocalDate startDate, LocalDate endDate);
    List<Appointment> findByDoctorIdAndAppointmentDateBetween(
        Long doctorId, LocalDate startDate, LocalDate endDate
    );
    
    // existsBy queries
    boolean existsByDoctorIdAndAppointmentDateAndAppointmentTime(
        Long doctorId, LocalDate date, java.time.LocalTime time
    );
    
    // Today's appointments
    List<Appointment> findByAppointmentDate(LocalDate date);
    
    // Sorting
    List<Appointment> findByPatientIdOrderByAppointmentDateDesc(Long patientId);
    List<Appointment> findByStatusOrderByAppointmentDateAsc(Appointment.AppointmentStatus status);
    
    // Pagination
    Page<Appointment> findByDoctorId(Long doctorId, Pageable pageable);
    Page<Appointment> findByStatus(Appointment.AppointmentStatus status, Pageable pageable);
}
