package com.healthcare.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.healthcare.model.Person;
import com.healthcare.repository.PersonRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PersonService {
    
    private final PersonRepository personRepository;
    
    // CREATE
    public Person createPerson(Person person) {
        if (personRepository.existsByEmail(person.getEmail())) {
            throw new RuntimeException("Email already exists: " + person.getEmail());
        }
        if (personRepository.existsByNationalId(person.getNationalId())) {
            throw new RuntimeException("National ID already exists: " + person.getNationalId());
        }
        return personRepository.save(person);
    }
    
    // READ - Get all
    public List<Person> getAllPersons() {
        return personRepository.findAll();
    }
    
    // READ - Get by ID
    public Person getPersonById(long id) {
        return personRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Person not found with id: " + id));
    }
    
    // READ - Get by email
    public Person getPersonByEmail(String email) {
        return personRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Person not found with email: " + email));
    }
    
    // REQUIRED: Get persons by province code
    public List<Person> getPersonsByProvinceCode(String provinceCode) {
        return personRepository.findByLocationProvinceCode(provinceCode);
    }
    
    // REQUIRED: Get persons by province name
    public List<Person> getPersonsByProvinceName(String provinceName) {
        return personRepository.findByLocationProvinceName(provinceName);
    }
    
    // Get by role
    public List<Person> getPersonsByRole(Person.Role role) {
        return personRepository.findByRole(role);
    }
    
    // Search by name
    public List<Person> searchByName(String name) {
        return personRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(name, name);
    }
    
    // UPDATE
    public Person updatePerson(long id, Person personDetails) {
        Person person = getPersonById(id);
        
        // Update fields
        person.setFirstName(personDetails.getFirstName());
        person.setLastName(personDetails.getLastName());
        person.setPhone(personDetails.getPhone());
        person.setDateOfBirth(personDetails.getDateOfBirth());
        person.setGender(personDetails.getGender());
        
        if (personDetails.getLocation() != null) {
            person.setLocation(personDetails.getLocation());
        }
        
        return personRepository.save(person);
    }
    
    // DELETE
    public void deletePerson(long id) {
        if (!personRepository.existsById(id)) {
            throw new RuntimeException("Person not found with id: " + id);
        }
        personRepository.deleteById(id);
    }
    
    // PAGINATION
    public Page<Person> getPersonsByRole(Person.Role role, Pageable pageable) {
        return personRepository.findByRole(role, pageable);
    }
    
    public Page<Person> getPersonsByProvinceName(String provinceName, Pageable pageable) {
        return personRepository.findByLocationProvinceName(provinceName, pageable);
    }
    
    // SORTING
    public List<Person> getAllPersonsSortedByName() {
        return personRepository.findAllByOrderByFirstNameAsc();
    }
}