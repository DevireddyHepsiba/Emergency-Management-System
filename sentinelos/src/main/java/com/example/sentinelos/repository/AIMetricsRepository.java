package com.example.sentinelos.repository;

import com.example.sentinelos.entity.AIMetrics;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AIMetricsRepository extends MongoRepository<AIMetrics, String> {
}

