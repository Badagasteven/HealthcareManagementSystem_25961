package com.healthcare;

import com.healthcare.model.*;
import com.healthcare.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

@Component
public class DataLoader implements CommandLineRunner {

    private final PersonRepository personRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AppointmentRepository appointmentRepository;

    public DataLoader(PersonRepository personRepository, RoleRepository roleRepository,
                      PasswordEncoder passwordEncoder, AppointmentRepository appointmentRepository) {
        this.personRepository = personRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.appointmentRepository = appointmentRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.count() == 0) {
            roleRepository.save(Role.builder().name("ADMIN").build());
            roleRepository.save(Role.builder().name("DOCTOR").build());
            roleRepository.save(Role.builder().name("PATIENT").build());
        }

        if (personRepository.count() == 0) {
            Role adminRole = roleRepository.findByName("ADMIN");
            Role doctorRole = roleRepository.findByName("DOCTOR");
            Role patientRole = roleRepository.findByName("PATIENT");

            // Create admin user matching frontend expectations
            Person admin = Person.builder()
                    .fullName("Admin User")
                    .email("badagaclass@gmail.com")
                    .password(passwordEncoder.encode("Admin123!"))
                    .roles(Set.of(adminRole))
                    .build();
            personRepository.save(admin);

            // Create doctor user matching frontend expectations
            Person doctor = Person.builder()
                    .fullName("Dr. Uwimana Grace")
                    .email("doctor@health.rw")
                    .password(passwordEncoder.encode("Doctor123!"))
                    .roles(Set.of(doctorRole))
                    .build();
            personRepository.save(doctor);

            // Create patient user matching frontend expectations
            Person patient = Person.builder()
                    .fullName("Uwase Marie")
                    .email("patient@health.rw")
                    .password(passwordEncoder.encode("Patient123!"))
                    .roles(Set.of(patientRole))
                    .build();
            personRepository.save(patient);

            Appointment appointment = Appointment.builder()
                    .patient(patient)
                    .doctor(doctor)
                    .date(LocalDate.now())
                    .time(LocalTime.now())
                    .status("pending")
                    .build();
            appointmentRepository.save(appointment);
        }
    }
}
