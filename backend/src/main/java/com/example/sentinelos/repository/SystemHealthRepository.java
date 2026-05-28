package com.example.sentinelos.repository;

import com.example.sentinelos.entity.SystemHealth;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SystemHealthRepository extends MongoRepository<SystemHealth, String> {
    Optional<SystemHealth> findByServiceName(String serviceName);
    List<SystemHealth> findByStatus(String status);
}

