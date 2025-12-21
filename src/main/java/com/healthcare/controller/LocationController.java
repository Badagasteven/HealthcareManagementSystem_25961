package com.healthcare.controller;

import com.healthcare.model.*;
import com.healthcare.service.LocationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping("/provinces")
    public List<Province> getAllProvinces() {
        return locationService.getAllProvinces();
    }

    @GetMapping("/districts")
    public List<District> getAllDistricts() {
        return locationService.getAllDistricts();
    }

    @GetMapping("/sectors")
    public List<Sector> getAllSectors() {
        return locationService.getAllSectors();
    }

    @GetMapping("/cells")
    public List<Cell> getAllCells() {
        return locationService.getAllCells();
    }

    @GetMapping("/villages")
    public List<Village> getAllVillages() {
        return locationService.getAllVillages();
    }
}
