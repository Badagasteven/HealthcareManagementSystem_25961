package com.healthcare.service;

import com.healthcare.repository.AppointmentRepository;
import com.healthcare.repository.PersonRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    private final PersonRepository personRepository;
    private final AppointmentRepository appointmentRepository;

    public DashboardService(PersonRepository personRepository, AppointmentRepository appointmentRepository) {
        this.personRepository = personRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public Map<String, Object> getDashboardSummary() {
        Map<String, Object> summary = new HashMap<>();

        summary.put("totalPatients", personRepository.countByRoles_Name("PATIENT"));
        summary.put("totalDoctors", personRepository.countByRoles_Name("DOCTOR"));
        summary.put("totalAppointments", appointmentRepository.count());

        Map<String, Long> appointmentsByStatus = new HashMap<>();
        appointmentsByStatus.put("pending", appointmentRepository.countByStatus("pending"));
        appointmentsByStatus.put("confirmed", appointmentRepository.countByStatus("confirmed"));
        appointmentsByStatus.put("cancelled", appointmentRepository.countByStatus("cancelled"));
        summary.put("appointmentsByStatus", appointmentsByStatus);

        return summary;
    }
}
