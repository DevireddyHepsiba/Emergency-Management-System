package com.example.auth.repository;

import com.example.auth.entity.User;
import com.example.auth.entity.Role;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);
    java.util.List<User> findByRole(Role role);
    long countByRole(Role role);
}

