package com.example.sentinelos.repository;

import com.example.sentinelos.entity.Hospital;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HospitalRepository extends MongoRepository<Hospital, String> {
    List<Hospital> findByStatus(String status);
    Optional<Hospital> findByName(String name);

    @Query(value = "{ 'bedsAvailable': { $gt: 0 } }", sort = "{ 'bedsAvailable': -1 }")
    List<Hospital> findAvailableHospitals();

    @Query(value = "{ 'icuAvailable': { $gt: 0 } }", sort = "{ 'icuAvailable': -1 }")
    List<Hospital> findICUAvailableHospitals();

    @Query(value = "{ 'ambulances': { $gt: 0 } }", sort = "{ 'ambulances': -1 }")
    List<Hospital> findHospitalsWithAmbulances();
}

