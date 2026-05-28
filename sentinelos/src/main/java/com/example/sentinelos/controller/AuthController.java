package com.example.sentinelos.controller;

import com.example.sentinelos.dto.LoginRequest;
import com.example.sentinelos.dto.LoginResponse;
import com.example.sentinelos.dto.RegisterRequest;
import com.example.sentinelos.dto.RegisterResponse;
import com.example.sentinelos.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request) {
        RegisterResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }
}
