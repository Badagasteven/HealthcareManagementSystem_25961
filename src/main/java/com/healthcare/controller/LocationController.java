package com.healthcare.controller;

import com.healthcare.model.Location;
import com.healthcare.service.LocationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin(origins = "*")
public class LocationController {
    
    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }
    
    @PostMapping
    public ResponseEntity<Location> createLocation(@RequestBody Location location) {
        return new ResponseEntity<>(locationService.createLocation(location), HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<List<Location>> getAllLocations() {
        return ResponseEntity.ok(locationService.getAllLocations());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Location> getLocationById(@PathVariable Long id) {
        return ResponseEntity.ok(locationService.getLocationById(id));
    }
    
    @GetMapping("/province-code/{provinceCode}")
    public ResponseEntity<List<Location>> getByProvinceCode(@PathVariable String provinceCode) {
        return ResponseEntity.ok(locationService.getLocationsByProvinceCode(provinceCode));
    }
    
    @GetMapping("/province-name/{provinceName}")
    public ResponseEntity<List<Location>> getByProvinceName(@PathVariable String provinceName) {
        return ResponseEntity.ok(locationService.getLocationsByProvinceName(provinceName));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Location> updateLocation(@PathVariable Long id, @RequestBody Location location) {
        return ResponseEntity.ok(locationService.updateLocation(id, location));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocation(@PathVariable Long id) {
        locationService.deleteLocation(id);
        return ResponseEntity.noContent().build();
    }

    // ADMIN: Delete all locations and reset identity (CASCADE)
    @DeleteMapping("/reset")
    public ResponseEntity<Void> resetLocations() {
        locationService.resetAllLocations();
        return ResponseEntity.noContent().build();
    }
}