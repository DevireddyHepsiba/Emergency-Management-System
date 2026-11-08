package com.example.emergency.repository;

import com.example.emergency.entity.Emergency;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmergencyRepository extends MongoRepository<Emergency, String> {
    long countByStatus(String status);
    List<Emergency> findByUserId(String userId);
    
    List<Emergency> findByStatus(String status);
    
    List<Emergency> findByEmergencyType(String emergencyType);
    
    List<Emergency> findByPriority(String priority);
    
    List<Emergency> findByCreatedAtAfter(LocalDateTime dateTime);
    
    List<Emergency> findByStatusOrderByCreatedAtDesc(String status);

    List<Emergency> findAllByOrderByCreatedAtDesc();
    
    Optional<Emergency> findById(String id);
}

