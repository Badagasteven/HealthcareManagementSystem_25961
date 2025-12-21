package com.healthcare.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.healthcare.model.Doctor;
import com.healthcare.repository.DoctorRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class DoctorService {
    
    private final DoctorRepository doctorRepository;
    
    public Doctor createDoctor(Doctor doctor) {
        if (doctorRepository.existsByLicenseNumber(doctor.getLicenseNumber())) {
            throw new RuntimeException("Doctor with license number already exists: " + doctor.getLicenseNumber());
        }
        return doctorRepository.save(doctor);
    }
    
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }
    
    public Doctor getDoctorById(long id) {
        return doctorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + id));
    }
    
    public List<Doctor> getDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecialization(specialization);
    }
    
    public List<Doctor> getDoctorsByHospital(Long hospitalId) {
        return doctorRepository.findByHospitalId(hospitalId);
    }
    
    public List<Doctor> getAvailableDoctors() {
        return doctorRepository.findByAvailabilityStatus(true);
    }
    
    public Doctor updateDoctor(long id, Doctor doctorDetails) {
        Doctor doctor = getDoctorById(id);
        doctor.setSpecialization(doctorDetails.getSpecialization());
        doctor.setYearsOfExperience(doctorDetails.getYearsOfExperience());
        doctor.setAvailabilityStatus(doctorDetails.getAvailabilityStatus());
        if (doctorDetails.getHospital() != null) {
            doctor.setHospital(doctorDetails.getHospital());
        }
        return doctorRepository.save(doctor);
    }
    
    public void deleteDoctor(long id) {
        doctorRepository.deleteById(id);
    }
    
    public Page<Doctor> getDoctorsBySpecialization(String specialization, Pageable pageable) {
        return doctorRepository.findBySpecialization(specialization, pageable);
    }
}