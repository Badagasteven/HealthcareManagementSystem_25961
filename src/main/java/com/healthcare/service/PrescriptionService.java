package com.healthcare.service;

import java.util.List;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.healthcare.model.Prescription;
import com.healthcare.repository.PrescriptionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PrescriptionService {
    
    private final PrescriptionRepository prescriptionRepository;
    
    @NonNull
    public Prescription createPrescription(@NonNull Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }
    
    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }
    
    public Prescription getPrescriptionById(long id) {
        return prescriptionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Prescription not found with id: " + id));
    }
    
    public List<Prescription> getPrescriptionsByMedicalRecord(Long medicalRecordId) {
        return prescriptionRepository.findByMedicalRecordId(medicalRecordId);
    }
    
    public Prescription updatePrescription(long id, Prescription prescriptionDetails) {
        Prescription prescription = getPrescriptionById(id);
        prescription.setMedicationName(prescriptionDetails.getMedicationName());
        prescription.setDosage(prescriptionDetails.getDosage());
        prescription.setFrequency(prescriptionDetails.getFrequency());
        prescription.setDuration(prescriptionDetails.getDuration());
        prescription.setInstructions(prescriptionDetails.getInstructions());
        return prescriptionRepository.save(prescription);
    }
    
    public void deletePrescription(long id) {
        prescriptionRepository.deleteById(id);
    }
}