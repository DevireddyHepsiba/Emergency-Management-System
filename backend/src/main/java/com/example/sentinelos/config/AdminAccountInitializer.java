package com.example.sentinelos.config;

import com.example.sentinelos.entity.Role;
import com.example.sentinelos.entity.User;
import com.example.sentinelos.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminAccountInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:}")
    private String adminEmail;

    @Value("${app.admin.password:}")
    private String adminPassword;

    @Override
    public void run(ApplicationArguments args) {
        if (adminEmail == null || adminEmail.isBlank() || adminPassword == null || adminPassword.length() < 12) {
            return;
        }

        User admin = userRepository.findByEmail(adminEmail.trim().toLowerCase())
                .orElseGet(() -> User.builder()
                        .name("System Administrator")
                        .email(adminEmail.trim().toLowerCase())
                        .build());
        // Apply the configured bootstrap password even if this email was
        // previously registered as a citizen or volunteer.
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);
    }
}
