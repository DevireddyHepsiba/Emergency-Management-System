package com.example.dispatch.repository;

import com.example.dispatch.entity.User;
import com.example.dispatch.entity.Role;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);
    java.util.List<User> findByRole(Role role);
    long countByRole(Role role);
}

