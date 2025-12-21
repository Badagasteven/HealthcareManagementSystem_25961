package com.healthcare.service;

import com.healthcare.model.Service;
import com.healthcare.repository.ServiceRepository;

import java.util.List;

@org.springframework.stereotype.Service
public class ServiceService {

    private final ServiceRepository serviceRepository;

    public ServiceService(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    public List<Service> getAllServices() {
        return serviceRepository.findAll();
    }

    public Service getServiceById(Long id) {
        return serviceRepository.findById(id).orElse(null);
    }

    public Service createService(Service service) {
        return serviceRepository.save(service);
    }

    public Service updateService(Long id, Service serviceDetails) {
        Service service = serviceRepository.findById(id).orElse(null);
        if (service != null) {
            service.setName(serviceDetails.getName());
            service.setCategory(serviceDetails.getCategory());
            service.setPriceRwf(serviceDetails.getPriceRwf());
            return serviceRepository.save(service);
        }
        return null;
    }

    public void deleteService(Long id) {
        serviceRepository.deleteById(id);
    }
}
