package com.example.dispatch.repository;

import com.example.dispatch.entity.AmbulanceUnit;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AmbulanceUnitRepository extends MongoRepository<AmbulanceUnit, String> {
    List<AmbulanceUnit> findByStatus(String status);
    List<AmbulanceUnit> findByHospitalId(String hospitalId);
}
