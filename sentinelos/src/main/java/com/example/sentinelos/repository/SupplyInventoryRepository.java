package com.example.sentinelos.repository;

import com.example.sentinelos.entity.SupplyInventory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SupplyInventoryRepository extends MongoRepository<SupplyInventory, String> {
    Optional<SupplyInventory> findByResourceType(String resourceType);
}

