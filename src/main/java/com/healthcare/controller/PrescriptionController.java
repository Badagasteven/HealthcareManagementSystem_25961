package com.healthcare.controller;

import com.healthcare.model.Prescription;
import com.healthcare.service.PrescriptionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    public PrescriptionController(PrescriptionService prescriptionService) {
        this.prescriptionService = prescriptionService;
    }

    @GetMapping
    public Page<Prescription> getAllPrescriptions(Pageable pageable) {
        return prescriptionService.getAllPrescriptions(pageable);
    }

    @GetMapping("/patient/{patientId}")
    public Page<Prescription> getPrescriptionsByPatientId(@PathVariable Long patientId, Pageable pageable) {
        return prescriptionService.getPrescriptionsByPatientId(patientId, pageable);
    }

    @GetMapping("/doctor/{doctorId}")
    public Page<Prescription> getPrescriptionsByDoctorId(@PathVariable Long doctorId, Pageable pageable) {
        return prescriptionService.getPrescriptionsByDoctorId(doctorId, pageable);
    }

    @GetMapping("/{id}")
    public Prescription getPrescriptionById(@PathVariable Long id) {
        return prescriptionService.getPrescriptionById(id);
    }

    @PostMapping
    public Prescription createPrescription(@RequestBody Prescription prescription) {
        return prescriptionService.createPrescription(prescription);
    }

    @PutMapping("/{id}")
    public Prescription updatePrescription(@PathVariable Long id, @RequestBody Prescription prescription) {
        return prescriptionService.updatePrescription(id, prescription);
    }

    @DeleteMapping("/{id}")
    public void deletePrescription(@PathVariable Long id) {
        prescriptionService.deletePrescription(id);
    }
}
