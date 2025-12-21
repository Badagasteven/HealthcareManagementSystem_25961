package com.healthcare.controller;

import com.healthcare.model.MedicalRecord;
import com.healthcare.service.MedicalRecordService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    public MedicalRecordController(MedicalRecordService medicalRecordService) {
        this.medicalRecordService = medicalRecordService;
    }

    @GetMapping
    public Page<MedicalRecord> getAllMedicalRecords(Pageable pageable) {
        return medicalRecordService.getAllMedicalRecords(pageable);
    }

    @GetMapping("/patient/{patientId}")
    public Page<MedicalRecord> getMedicalRecordsByPatientId(@PathVariable Long patientId, Pageable pageable) {
        return medicalRecordService.getMedicalRecordsByPatientId(patientId, pageable);
    }

    @GetMapping("/doctor/{doctorId}")
    public Page<MedicalRecord> getMedicalRecordsByDoctorId(@PathVariable Long doctorId, Pageable pageable) {
        return medicalRecordService.getMedicalRecordsByDoctorId(doctorId, pageable);
    }

    @GetMapping("/{id}")
    public MedicalRecord getMedicalRecordById(@PathVariable Long id) {
        return medicalRecordService.getMedicalRecordById(id);
    }

    @PostMapping
    public MedicalRecord createMedicalRecord(@RequestBody MedicalRecord medicalRecord) {
        return medicalRecordService.createMedicalRecord(medicalRecord);
    }

    @PutMapping("/{id}")
    public MedicalRecord updateMedicalRecord(@PathVariable Long id, @RequestBody MedicalRecord medicalRecord) {
        return medicalRecordService.updateMedicalRecord(id, medicalRecord);
    }

    @DeleteMapping("/{id}")
    public void deleteMedicalRecord(@PathVariable Long id) {
        medicalRecordService.deleteMedicalRecord(id);
    }
}
