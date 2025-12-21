package com.healthcare.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.healthcare.model.Patient;
import com.healthcare.repository.PatientRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PatientService {
    
    private final PatientRepository patientRepository;
    
    public Patient createPatient(Patient patient) {
        if (patientRepository.existsByPersonId(patient.getPerson().getId())) {
            throw new RuntimeException("Patient already exists for this person");
        }
        return patientRepository.save(patient);
    }
    
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }
    
    public Patient getPatientById(long id) {
        return patientRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Patient not found with id: " + id));
    }
    
    public List<Patient> getPatientsByBloodType(String bloodType) {
        return patientRepository.findByBloodType(bloodType);
    }
    
    public Patient updatePatient(long id, Patient patientDetails) {
        Patient patient = getPatientById(id);
        patient.setBloodType(patientDetails.getBloodType());
        patient.setAllergies(patientDetails.getAllergies());
        patient.setEmergencyContact(patientDetails.getEmergencyContact());
        return patientRepository.save(patient);
    }
    
    public void deletePatient(long id) {
        patientRepository.deleteById(id);
    }
    
    public Page<Patient> getPatientsByBloodType(String bloodType, Pageable pageable) {
        return patientRepository.findByBloodType(bloodType, pageable);
    }
}