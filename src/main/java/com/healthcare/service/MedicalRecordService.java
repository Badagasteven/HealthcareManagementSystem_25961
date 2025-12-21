package com.healthcare.service;

import com.healthcare.model.MedicalRecord;
import com.healthcare.repository.MedicalRecordRepository;
import org.springframework.lang.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MedicalRecordService {
    
    private final MedicalRecordRepository medicalRecordRepository;
    
    @NonNull
    public MedicalRecord createMedicalRecord(@NonNull MedicalRecord medicalRecord) {
        return medicalRecordRepository.save(medicalRecord);
    }
    
    public List<MedicalRecord> getAllMedicalRecords() {
        return medicalRecordRepository.findAll();
    }
    
    public MedicalRecord getMedicalRecordById(long id) {
        return medicalRecordRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Medical record not found with id: " + id));
    }
    
    public List<MedicalRecord> getMedicalRecordsByPatient(Long patientId) {
        return medicalRecordRepository.findByPatientId(patientId);
    }
    
    public List<MedicalRecord> getMedicalRecordsByDoctor(Long doctorId) {
        return medicalRecordRepository.findByDoctorId(doctorId);
    }
    
    public MedicalRecord updateMedicalRecord(long id, MedicalRecord recordDetails) {
        MedicalRecord record = getMedicalRecordById(id);
        record.setDiagnosis(recordDetails.getDiagnosis());
        record.setTreatmentDate(recordDetails.getTreatmentDate());
        record.setNotes(recordDetails.getNotes());
        return medicalRecordRepository.save(record);
    }
    
    public void deleteMedicalRecord(long id) {
        medicalRecordRepository.deleteById(id);
    }
    
    public Page<MedicalRecord> getMedicalRecordsByPatient(Long patientId, Pageable pageable) {
        return medicalRecordRepository.findByPatientId(patientId, pageable);
    }
}