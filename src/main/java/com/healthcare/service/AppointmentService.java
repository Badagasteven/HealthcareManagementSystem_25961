package com.healthcare.service;

import com.healthcare.model.Appointment;
import com.healthcare.repository.AppointmentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public Page<Appointment> getAllAppointments(Pageable pageable) {
        return appointmentRepository.findAll(pageable);
    }

    public Page<Appointment> getAppointmentsByPatientId(Long patientId, Pageable pageable) {
        return appointmentRepository.findByPatientId(patientId, pageable);
    }

    public Page<Appointment> getAppointmentsByDoctorId(Long doctorId, Pageable pageable) {
        return appointmentRepository.findByDoctorId(doctorId, pageable);
    }

    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id).orElse(null);
    }

    public Appointment createAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    public Appointment updateAppointment(Long id, Appointment appointmentDetails) {
        Appointment appointment = appointmentRepository.findById(id).orElse(null);
        if (appointment != null) {
            appointment.setPatient(appointmentDetails.getPatient());
            appointment.setDoctor(appointmentDetails.getDoctor());
            appointment.setDate(appointmentDetails.getDate());
            appointment.setTime(appointmentDetails.getTime());
            appointment.setStatus(appointmentDetails.getStatus());
            appointment.setHospitalId(appointmentDetails.getHospitalId());
            appointment.setHospitalName(appointmentDetails.getHospitalName());
            appointment.setInsurance(appointmentDetails.getInsurance());
            appointment.setServiceId(appointmentDetails.getServiceId());
            appointment.setServiceName(appointmentDetails.getServiceName());
            return appointmentRepository.save(appointment);
        }
        return null;
    }

    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }
}
