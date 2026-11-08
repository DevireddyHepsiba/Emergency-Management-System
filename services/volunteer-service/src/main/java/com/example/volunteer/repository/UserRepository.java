package com.example.volunteer.repository;

import com.example.volunteer.entity.User;
import com.example.volunteer.entity.Role;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);
    java.util.List<User> findByRole(Role role);
    long countByRole(Role role);
}

