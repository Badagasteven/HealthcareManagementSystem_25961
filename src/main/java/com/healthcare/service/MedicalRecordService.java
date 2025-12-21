package com.healthcare.service;

import com.healthcare.model.MedicalRecord;
import com.healthcare.repository.MedicalRecordRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;

    public MedicalRecordService(MedicalRecordRepository medicalRecordRepository) {
        this.medicalRecordRepository = medicalRecordRepository;
    }

    public Page<MedicalRecord> getAllMedicalRecords(Pageable pageable) {
        return medicalRecordRepository.findAll(pageable);
    }

    public Page<MedicalRecord> getMedicalRecordsByPatientId(Long patientId, Pageable pageable) {
        return medicalRecordRepository.findByPatientId(patientId, pageable);
    }

    public Page<MedicalRecord> getMedicalRecordsByDoctorId(Long doctorId, Pageable pageable) {
        return medicalRecordRepository.findByDoctorId(doctorId, pageable);
    }

    public MedicalRecord getMedicalRecordById(Long id) {
        return medicalRecordRepository.findById(id).orElse(null);
    }

    public MedicalRecord createMedicalRecord(MedicalRecord medicalRecord) {
        return medicalRecordRepository.save(medicalRecord);
    }

    public MedicalRecord updateMedicalRecord(Long id, MedicalRecord medicalRecordDetails) {
        MedicalRecord medicalRecord = medicalRecordRepository.findById(id).orElse(null);
        if (medicalRecord != null) {
            medicalRecord.setPatient(medicalRecordDetails.getPatient());
            medicalRecord.setDoctor(medicalRecordDetails.getDoctor());
            medicalRecord.setDiagnosis(medicalRecordDetails.getDiagnosis());
            medicalRecord.setNotes(medicalRecordDetails.getNotes());
            medicalRecord.setDate(medicalRecordDetails.getDate());
            medicalRecord.setReviewed(medicalRecordDetails.isReviewed());
            return medicalRecordRepository.save(medicalRecord);
        }
        return null;
    }

    public void deleteMedicalRecord(Long id) {
        medicalRecordRepository.deleteById(id);
    }
}
