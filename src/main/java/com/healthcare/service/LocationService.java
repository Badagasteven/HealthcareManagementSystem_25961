package com.healthcare.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.healthcare.model.Location;
import com.healthcare.repository.LocationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class LocationService {
    
    private final LocationRepository locationRepository;
    
    public Location createLocation(Location location) {
        // If a parent with only id was posted, reattach the managed entity
        if (location.getParent() != null && location.getParent().getId() != null) {
            Location parent = location.getParent();
            Long parentId = parent.getId();
            location.setParent(
                locationRepository.findById(parentId)
                    .orElseThrow(() -> new RuntimeException("Parent location not found with id: " + parentId))
            );
        }
        return locationRepository.save(location);
    }
    
    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }
    
    public Location getLocationById(long id) {
        return locationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Location not found with id: " + id));
    }
    
    public List<Location> getLocationsByProvinceCode(String provinceCode) {
        return locationRepository.findByProvinceCode(provinceCode);
    }
    
    public List<Location> getLocationsByProvinceName(String provinceName) {
        return locationRepository.findByProvinceName(provinceName);
    }
    
    public Location updateLocation(long id, Location locationDetails) {
        Location location = getLocationById(id);
        location.setProvinceCode(locationDetails.getProvinceCode());
        location.setProvinceName(locationDetails.getProvinceName());
        location.setDistrictCode(locationDetails.getDistrictCode());
        location.setDistrictName(locationDetails.getDistrictName());
        location.setSectorCode(locationDetails.getSectorCode());
        location.setSectorName(locationDetails.getSectorName());
        location.setCellCode(locationDetails.getCellCode());
        location.setCellName(locationDetails.getCellName());
        location.setVillageName(locationDetails.getVillageName());
        return locationRepository.save(location);
    }
    
    public void deleteLocation(long id) {
        locationRepository.deleteById(id);
    }

    // ADMIN: wipe all locations and reset IDs (also deletes dependents via CASCADE)
    public void resetAllLocations() {
        locationRepository.truncateAll();
    }
}