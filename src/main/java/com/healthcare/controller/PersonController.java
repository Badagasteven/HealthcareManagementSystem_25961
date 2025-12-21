package com.healthcare.controller;

import com.healthcare.model.Person;
import com.healthcare.service.PersonService;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/persons")
@CrossOrigin(origins="http://localhost:5173")
public class PersonController {
  private final PersonService service;

  public PersonController(PersonService service) {
    this.service = service;
  }

  // CRUD
  @PostMapping
  public Person create(@RequestBody Person person) {
    return service.create(person);
  }

  @GetMapping
  public Page<Person> list(
      @RequestParam(defaultValue="0") int page,
      @RequestParam(defaultValue="10") int size,
      @RequestParam(defaultValue="id") String sortBy,
      @RequestParam(defaultValue="asc") String dir
  ) {
    Sort sort = dir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
    Pageable pageable = PageRequest.of(page, size, sort);
    return service.list(pageable);
  }

  @GetMapping("/{id}")
  public Person get(@PathVariable Long id) {
    return service.get(id);
  }

  @PutMapping("/{id}")
  public Person update(@PathVariable Long id, @RequestBody Person person) {
    return service.update(id, person);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable Long id) {
    service.delete(id);
  }

  // ✅ Required: retrieve users by province code OR province name
  @GetMapping("/by-province")
  public Page<Person> byProvince(
      @RequestParam(required=false) String code,
      @RequestParam(required=false) String name,
      @RequestParam(defaultValue="0") int page,
      @RequestParam(defaultValue="10") int size,
      @RequestParam(defaultValue="id") String sortBy,
      @RequestParam(defaultValue="asc") String dir
  ) {
    Sort sort = dir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
    Pageable pageable = PageRequest.of(page, size, sort);

    if (code != null && !code.isBlank()) return service.usersByProvinceCode(code, pageable);
    if (name != null && !name.isBlank()) return service.usersByProvinceName(name, pageable);

    throw new RuntimeException("Provide province code or name");
  }
}
