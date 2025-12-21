package com.healthcare.service;

import com.healthcare.model.Hospital;
import com.healthcare.repository.HospitalRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HospitalService {

    private final HospitalRepository hospitalRepository;

    public HospitalService(HospitalRepository hospitalRepository) {
        this.hospitalRepository = hospitalRepository;
    }

    public List<Hospital> getAllHospitals() {
        return hospitalRepository.findAll();
    }

    public Hospital getHospitalById(Long id) {
        return hospitalRepository.findById(id).orElse(null);
    }

    public Hospital createHospital(Hospital hospital) {
        return hospitalRepository.save(hospital);
    }

    public Hospital updateHospital(Long id, Hospital hospitalDetails) {
        Hospital hospital = hospitalRepository.findById(id).orElse(null);
        if (hospital != null) {
            hospital.setName(hospitalDetails.getName());
            hospital.setProvince(hospitalDetails.getProvince());
            hospital.setDistrict(hospitalDetails.getDistrict());
            hospital.setCategory(hospitalDetails.getCategory());
            return hospitalRepository.save(hospital);
        }
        return null;
    }

    public void deleteHospital(Long id) {
        hospitalRepository.deleteById(id);
    }
}
