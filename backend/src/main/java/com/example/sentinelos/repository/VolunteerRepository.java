package com.example.sentinelos.repository;

import com.example.sentinelos.entity.Volunteer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VolunteerRepository extends MongoRepository<Volunteer, String> {
    List<Volunteer> findByStatus(String status);
    List<Volunteer> findBySpecialization(String specialization);
    List<Volunteer> findByNgoOrganization(String ngoOrganization);
    long countByStatus(String status);
}


