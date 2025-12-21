package com.healthcare.controller;

import com.healthcare.model.Person;
import com.healthcare.service.PersonService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/persons")
public class PersonController {

    private final PersonService personService;

    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @GetMapping
    public Page<Person> getAllPersons(Pageable pageable) {
        return personService.list(pageable);
    }

    @GetMapping("/role/{roleName}")
    public Page<Person> getAllPersonsByRole(@PathVariable String roleName, Pageable pageable) {
        return personService.list(roleName, pageable);
    }

    @GetMapping("/{id}")
    public Person getPersonById(@PathVariable Long id) {
        return personService.get(id);
    }

    @PostMapping
    public Person createPerson(@RequestBody Person person) {
        return personService.create(person);
    }

    @PutMapping("/{id}")
    public Person updatePerson(@PathVariable Long id, @RequestBody Person person) {
        return personService.update(id, person);
    }

    @DeleteMapping("/{id}")
    public void deletePerson(@PathVariable Long id) {
        personService.delete(id);
    }
}
