package com.example.auth.service;

import com.example.auth.dto.LoginRequest;
import com.example.auth.dto.LoginResponse;
import com.example.auth.dto.RegisterRequest;
import com.example.auth.dto.RegisterResponse;
import com.example.auth.entity.Role;
import com.example.auth.entity.User;
import com.example.auth.exception.UnauthorizedException;
import com.example.auth.repository.UserRepository;
import com.example.auth.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Locale;

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
        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        // Generate token
        String token = jwtUtil.generateToken(user.getEmail());

        return LoginResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().toString())
                .hospitalId(user.getHospitalId())
                .message("Login successful")
                .build();
    }

    public RegisterResponse register(RegisterRequest request) {
        String email = request.getEmail() == null ? null : request.getEmail().trim().toLowerCase(Locale.ROOT);
        // Validate input
        if (email == null || email.isEmpty()) {
            throw new UnauthorizedException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new UnauthorizedException("Password is required");
        }
        if (request.getName() == null || request.getName().isEmpty()) {
            throw new UnauthorizedException("Name is required");
        }

        // Check if user already exists
        if (userRepository.findByEmail(email).isPresent()) {
            throw new UnauthorizedException("Email already registered");
        }

        Role role;
        try {
            role = Role.valueOf(request.getRole() != null ? request.getRole().toUpperCase() : "CITIZEN");
        } catch (IllegalArgumentException exception) {
            throw new UnauthorizedException("Invalid role");
        }
        if (role == Role.ADMIN) {
            throw new UnauthorizedException("Administrator accounts must be created through the administrator console");
        }
        if (role != Role.CITIZEN && role != Role.VOLUNTEER) {
            throw new UnauthorizedException("Public registration is limited to citizen and volunteer accounts");
        }

        // Create new user
        User user = User.builder()
                .name(request.getName())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
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
