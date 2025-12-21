package com.healthcare.controller;

import com.healthcare.model.Person;
import com.healthcare.service.PersonService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/persons")
@CrossOrigin(origins = "*")
public class PersonController {
    
    private final PersonService personService;

    public PersonController(PersonService personService) {
        this.personService = personService;
    }
    
    // CREATE
    @PostMapping
    public ResponseEntity<Person> createPerson(@RequestBody Person person) {
        Person created = personService.createPerson(person);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
    
    // READ - Get all
    @GetMapping
    public ResponseEntity<List<Person>> getAllPersons() {
        return ResponseEntity.ok(personService.getAllPersons());
    }
    
    // READ - Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<Person> getPersonById(@PathVariable Long id) {
        return ResponseEntity.ok(personService.getPersonById(id));
    }
    
    // READ - Get by email
    @GetMapping("/email/{email}")
    public ResponseEntity<Person> getPersonByEmail(@PathVariable String email) {
        return ResponseEntity.ok(personService.getPersonByEmail(email));
    }
    
    // REQUIRED: Get persons by province code
    @GetMapping("/by-province-code/{provinceCode}")
    public ResponseEntity<List<Person>> getPersonsByProvinceCode(@PathVariable String provinceCode) {
        return ResponseEntity.ok(personService.getPersonsByProvinceCode(provinceCode));
    }
    
    // REQUIRED: Get persons by province name
    @GetMapping("/by-province-name/{provinceName}")
    public ResponseEntity<List<Person>> getPersonsByProvinceName(@PathVariable String provinceName) {
        return ResponseEntity.ok(personService.getPersonsByProvinceName(provinceName));
    }
    
    // REQUIRED: Get province from user (through location relationship)
    @GetMapping("/{userId}/location")
    public ResponseEntity<Object> getUserLocation(@PathVariable Long userId) {
        Person person = personService.getPersonById(userId);
        return ResponseEntity.ok(person.getLocation());
    }
    
    // Get by role
    @GetMapping("/role/{role}")
    public ResponseEntity<List<Person>> getPersonsByRole(@PathVariable Person.Role role) {
        return ResponseEntity.ok(personService.getPersonsByRole(role));
    }
    
    // Search by name
    @GetMapping("/search")
    public ResponseEntity<List<Person>> searchByName(@RequestParam String name) {
        return ResponseEntity.ok(personService.searchByName(name));
    }
    
    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Person> updatePerson(@PathVariable Long id, @RequestBody Person person) {
        return ResponseEntity.ok(personService.updatePerson(id, person));
    }
    
    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePerson(@PathVariable Long id) {
        personService.deletePerson(id);
        return ResponseEntity.noContent().build();
    }
    
    // PAGINATION - Get persons by role with pagination
    @GetMapping("/role/{role}/paginated")
    public ResponseEntity<Page<Person>> getPersonsByRolePaginated(
            @PathVariable Person.Role role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(personService.getPersonsByRole(role, pageable));
    }
    
    // SORTING - Get all persons sorted by name
    @GetMapping("/sorted")
    public ResponseEntity<List<Person>> getAllPersonsSorted() {
        return ResponseEntity.ok(personService.getAllPersonsSortedByName());
    }
}