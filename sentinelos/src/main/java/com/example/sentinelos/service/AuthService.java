package com.example.sentinelos.service;

import com.example.sentinelos.dto.LoginRequest;
import com.example.sentinelos.dto.LoginResponse;
import com.example.sentinelos.dto.RegisterRequest;
import com.example.sentinelos.dto.RegisterResponse;
import com.example.sentinelos.entity.Role;
import com.example.sentinelos.entity.User;
import com.example.sentinelos.exception.UnauthorizedException;
import com.example.sentinelos.repository.UserRepository;
import com.example.sentinelos.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {
        // Validate input
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            throw new UnauthorizedException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new UnauthorizedException("Password is required");
        }

        // Find user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        // Generate token
        String token = jwtUtil.generateToken(user.getEmail());

        return LoginResponse.builder()
                .token(token)
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().toString())
                .message("Login successful")
                .build();
    }

    public RegisterResponse register(RegisterRequest request) {
        // Validate input
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            throw new UnauthorizedException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new UnauthorizedException("Password is required");
        }
        if (request.getName() == null || request.getName().isEmpty()) {
            throw new UnauthorizedException("Name is required");
        }

        // Check if user already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UnauthorizedException("Email already registered");
        }

        // Create new user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.valueOf(request.getRole() != null ? request.getRole() : "CITIZEN"))
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .build();

        // Save user
        userRepository.save(user);

        return RegisterResponse.builder()
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().toString())
                .message("Registration successful")
                .build();
    }
}
