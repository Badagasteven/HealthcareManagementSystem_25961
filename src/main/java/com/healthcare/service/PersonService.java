package com.healthcare.service;

import com.healthcare.model.Person;
import com.healthcare.repository.PersonRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
public class PersonService {
  private final PersonRepository repo;

  public PersonService(PersonRepository repo) {
    this.repo = repo;
  }

  public Person create(Person person) {
    if (repo.existsByEmail(person.getEmail())) {
      throw new RuntimeException("Email already exists");
    }
    return repo.save(person);
  }

  public Page<Person> list(Pageable pageable) {
    return repo.findAll(pageable);
  }

  public Person get(Long id) {
    return repo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
  }

  public Person update(Long id, Person updated) {
    Person existing = get(id);
    existing.setFullName(updated.getFullName());
    existing.setVillage(updated.getVillage());
    return repo.save(existing);
  }

  public void delete(Long id) {
    repo.deleteById(id);
  }

  public Page<Person> usersByProvinceCode(String code, Pageable pageable) {
    return repo.findByVillage_Cell_Sector_District_Province_Code(code, pageable);
  }

  public Page<Person> usersByProvinceName(String name, Pageable pageable) {
    return repo.findByVillage_Cell_Sector_District_Province_NameIgnoreCase(name, pageable);
  }
}
