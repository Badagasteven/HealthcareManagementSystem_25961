package com.healthcare.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.healthcare.model.Hospital;
import com.healthcare.repository.HospitalRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class HospitalService {
    
    private final HospitalRepository hospitalRepository;
    
    public Hospital createHospital(Hospital hospital) {
        if (hospitalRepository.existsByName(hospital.getName())) {
            throw new RuntimeException("Hospital already exists with name: " + hospital.getName());
        }
        return hospitalRepository.save(hospital);
    }
    
    public List<Hospital> getAllHospitals() {
        return hospitalRepository.findAll();
    }
    
    public Hospital getHospitalById(long id) {
        return hospitalRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Hospital not found with id: " + id));
    }
    
    public List<Hospital> getHospitalsByProvinceCode(String provinceCode) {
        return hospitalRepository.findByLocationProvinceCode(provinceCode);
    }
    
    public List<Hospital> getHospitalsByType(Hospital.HospitalType type) {
        return hospitalRepository.findByType(type);
    }
    
    public List<Hospital> searchHospitalsByName(String name) {
        return hospitalRepository.findByNameContainingIgnoreCase(name);
    }
    
    public Hospital updateHospital(long id, Hospital hospitalDetails) {
        Hospital hospital = getHospitalById(id);
        hospital.setName(hospitalDetails.getName());
        hospital.setType(hospitalDetails.getType());
        hospital.setCapacity(hospitalDetails.getCapacity());
        if (hospitalDetails.getLocation() != null) {
            hospital.setLocation(hospitalDetails.getLocation());
        }
        return hospitalRepository.save(hospital);
    }
    
    public void deleteHospital(long id) {
        hospitalRepository.deleteById(id);
    }
    
    public Page<Hospital> getHospitalsByType(Hospital.HospitalType type, Pageable pageable) {
        return hospitalRepository.findByType(type, pageable);
    }
}