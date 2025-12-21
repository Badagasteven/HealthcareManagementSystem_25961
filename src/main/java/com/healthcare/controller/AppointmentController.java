package com.healthcare.controller;

import com.healthcare.model.Appointment;
import com.healthcare.service.AppointmentService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public Page<Appointment> getAllAppointments(Pageable pageable) {
        return appointmentService.getAllAppointments(pageable);
    }

    @GetMapping("/patient/{patientId}")
    public Page<Appointment> getAppointmentsByPatientId(@PathVariable Long patientId, Pageable pageable) {
        return appointmentService.getAppointmentsByPatientId(patientId, pageable);
    }

    @GetMapping("/doctor/{doctorId}")
    public Page<Appointment> getAppointmentsByDoctorId(@PathVariable Long doctorId, Pageable pageable) {
        return appointmentService.getAppointmentsByDoctorId(doctorId, pageable);
    }

    @GetMapping("/{id}")
    public Appointment getAppointmentById(@PathVariable Long id) {
        return appointmentService.getAppointmentById(id);
    }

    @PostMapping
    public Appointment createAppointment(@RequestBody Appointment appointment) {
        return appointmentService.createAppointment(appointment);
    }

    @PutMapping("/{id}")
    public Appointment updateAppointment(@PathVariable Long id, @RequestBody Appointment appointment) {
        return appointmentService.updateAppointment(id, appointment);
    }

    @DeleteMapping("/{id}")
    public void deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
    }
}
