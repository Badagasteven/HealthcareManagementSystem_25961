package com.healthcare.service;

import com.healthcare.model.*;
import com.healthcare.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationService {

    private final ProvinceRepository provinceRepository;
    private final DistrictRepository districtRepository;
    private final SectorRepository sectorRepository;
    private final CellRepository cellRepository;
    private final VillageRepository villageRepository;

    public LocationService(ProvinceRepository provinceRepository, DistrictRepository districtRepository,
                           SectorRepository sectorRepository, CellRepository cellRepository,
                           VillageRepository villageRepository) {
        this.provinceRepository = provinceRepository;
        this.districtRepository = districtRepository;
        this.sectorRepository = sectorRepository;
        this.cellRepository = cellRepository;
        this.villageRepository = villageRepository;
    }

    public List<Province> getAllProvinces() {
        return provinceRepository.findAll();
    }

    public List<District> getAllDistricts() {
        return districtRepository.findAll();
    }

    public List<Sector> getAllSectors() {
        return sectorRepository.findAll();
    }

    public List<Cell> getAllCells() {
        return cellRepository.findAll();
    }

    public List<Village> getAllVillages() {
        return villageRepository.findAll();
    }
}
