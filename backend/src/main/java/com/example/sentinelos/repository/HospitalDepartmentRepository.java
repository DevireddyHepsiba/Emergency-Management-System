package com.example.sentinelos.repository;

import com.example.sentinelos.entity.HospitalDepartment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HospitalDepartmentRepository extends MongoRepository<HospitalDepartment, String> {
    List<HospitalDepartment> findByHospitalId(String hospitalId);
    Optional<HospitalDepartment> findByHospitalIdAndDepartmentName(String hospitalId, String departmentName);
}

