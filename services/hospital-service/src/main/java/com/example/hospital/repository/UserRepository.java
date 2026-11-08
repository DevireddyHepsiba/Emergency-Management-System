package com.example.hospital.repository;

import com.example.hospital.entity.User;
import com.example.hospital.entity.Role;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);
    java.util.List<User> findByRole(Role role);
    long countByRole(Role role);
}

