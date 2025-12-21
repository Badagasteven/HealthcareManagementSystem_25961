package com.healthcare.specification;

import com.healthcare.model.Person;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;

public class PersonSpecification implements Specification<Person> {

    private final String searchTerm;

    public PersonSpecification(String searchTerm) {
        this.searchTerm = searchTerm;
    }

    @Override
    public Predicate toPredicate(Root<Person> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
        if (searchTerm == null || searchTerm.isEmpty()) {
            return cb.isTrue(cb.literal(true)); // always true = no filtering
        }
        return cb.or(
                cb.like(cb.lower(root.get("fullName")), "%" + searchTerm.toLowerCase() + "%"),
                cb.like(cb.lower(root.get("email")), "%" + searchTerm.toLowerCase() + "%")
        );
    }
}
