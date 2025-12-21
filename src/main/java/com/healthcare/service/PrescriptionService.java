package com.healthcare.service;

import com.healthcare.model.Prescription;
import com.healthcare.repository.PrescriptionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;

    public PrescriptionService(PrescriptionRepository prescriptionRepository) {
        this.prescriptionRepository = prescriptionRepository;
    }

    public Page<Prescription> getAllPrescriptions(Pageable pageable) {
        return prescriptionRepository.findAll(pageable);
    }

    public Page<Prescription> getPrescriptionsByPatientId(Long patientId, Pageable pageable) {
        return prescriptionRepository.findByPatientId(patientId, pageable);
    }

    public Page<Prescription> getPrescriptionsByDoctorId(Long doctorId, Pageable pageable) {
        return prescriptionRepository.findByDoctorId(doctorId, pageable);
    }

    public Prescription getPrescriptionById(Long id) {
        return prescriptionRepository.findById(id).orElse(null);
    }

    public Prescription createPrescription(Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }

    public Prescription updatePrescription(Long id, Prescription prescriptionDetails) {
        Prescription prescription = prescriptionRepository.findById(id).orElse(null);
        if (prescription != null) {
            prescription.setPatient(prescriptionDetails.getPatient());
            prescription.setDoctor(prescriptionDetails.getDoctor());
            prescription.setMedication(prescriptionDetails.getMedication());
            prescription.setDosage(prescriptionDetails.getDosage());
            prescription.setFrequency(prescriptionDetails.getFrequency());
            prescription.setDurationDays(prescriptionDetails.getDurationDays());
            prescription.setInstructions(prescriptionDetails.getInstructions());
            prescription.setDateIssued(prescriptionDetails.getDateIssued());
            prescription.setStatus(prescriptionDetails.getStatus());
            return prescriptionRepository.save(prescription);
        }
        return null;
    }

    public void deletePrescription(Long id) {
        prescriptionRepository.deleteById(id);
    }
}
