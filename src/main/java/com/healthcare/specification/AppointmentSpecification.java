package com.healthcare.specification;

import com.healthcare.model.Appointment;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;

public class AppointmentSpecification implements Specification<Appointment> {

    private final String searchTerm;

    public AppointmentSpecification(String searchTerm) {
        this.searchTerm = searchTerm;
    }

    @Override
    public Predicate toPredicate(Root<Appointment> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
        if (searchTerm == null || searchTerm.isEmpty()) {
            return cb.isTrue(cb.literal(true)); // always true = no filtering
        }
        return cb.like(cb.lower(root.get("status")), "%" + searchTerm.toLowerCase() + "%");
    }
}
