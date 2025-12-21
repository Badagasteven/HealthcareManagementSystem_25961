package com.healthcare.controller;

import com.healthcare.model.*;
import com.healthcare.service.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
// ========== HOSPITAL CONTROLLER ==========
@RestController
@RequestMapping("/api/hospitals")
@CrossOrigin(origins = "*")
public class HospitalController {
    
    private final HospitalService hospitalService;

    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }
    
    @PostMapping
    public ResponseEntity<Hospital> createHospital(@RequestBody Hospital hospital) {
        return new ResponseEntity<>(hospitalService.createHospital(hospital), HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<List<Hospital>> getAllHospitals() {
        return ResponseEntity.ok(hospitalService.getAllHospitals());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Hospital> getHospitalById(@PathVariable Long id) {
        return ResponseEntity.ok(hospitalService.getHospitalById(id));
    }
    
    @GetMapping("/province/{provinceCode}")
    public ResponseEntity<List<Hospital>> getHospitalsByProvince(@PathVariable String provinceCode) {
        return ResponseEntity.ok(hospitalService.getHospitalsByProvinceCode(provinceCode));
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Hospital>> getHospitalsByType(@PathVariable Hospital.HospitalType type) {
        return ResponseEntity.ok(hospitalService.getHospitalsByType(type));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Hospital>> searchHospitals(@RequestParam String name) {
        return ResponseEntity.ok(hospitalService.searchHospitalsByName(name));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Hospital> updateHospital(@PathVariable Long id, @RequestBody Hospital hospital) {
        return ResponseEntity.ok(hospitalService.updateHospital(id, hospital));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHospital(@PathVariable Long id) {
        hospitalService.deleteHospital(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/type/{type}/paginated")
    public ResponseEntity<Page<Hospital>> getHospitalsByTypePaginated(
            @PathVariable Hospital.HospitalType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(hospitalService.getHospitalsByType(type, PageRequest.of(page, size)));
    }
}
