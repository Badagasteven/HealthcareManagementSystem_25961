package com.healthcare.service;

import com.healthcare.model.Appointment;
import com.healthcare.model.Person;
import com.healthcare.repository.AppointmentRepository;
import com.healthcare.repository.PersonRepository;
import com.healthcare.specification.AppointmentSpecification;
import com.healthcare.specification.PersonSpecification;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SearchService {

    private final PersonRepository personRepository;
    private final AppointmentRepository appointmentRepository;

    public SearchService(PersonRepository personRepository, AppointmentRepository appointmentRepository) {
        this.personRepository = personRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public Map<String, Object> search(String searchTerm) {
        Map<String, Object> results = new HashMap<>();

        Specification<Person> personSpec = new PersonSpecification(searchTerm);
        List<Person> persons = personRepository.findAll(personSpec);
        results.put("persons", persons);

        Specification<Appointment> appointmentSpec = new AppointmentSpecification(searchTerm);
        List<Appointment> appointments = appointmentRepository.findAll(appointmentSpec);
        results.put("appointments", appointments);

        return results;
    }
}
