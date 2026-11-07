package com.example.sentinelos.controller;

import com.example.sentinelos.repository.VolunteerRepository;
import com.example.sentinelos.repository.SupplyInventoryRepository;
import com.example.sentinelos.repository.AIMetricsRepository;
import com.example.sentinelos.repository.SystemHealthRepository;
import com.example.sentinelos.repository.EmergencyRepository;
import com.example.sentinelos.repository.RescueMissionRepository;
import com.example.sentinelos.repository.HospitalRepository;
import com.example.sentinelos.repository.UserRepository;
import com.example.sentinelos.entity.Role;
import com.example.sentinelos.entity.User;
import com.example.sentinelos.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AdminDashboardController {

    private final VolunteerRepository volunteerRepository;
    private final SupplyInventoryRepository supplyInventoryRepository;
    private final AIMetricsRepository aiMetricsRepository;
    private final SystemHealthRepository systemHealthRepository;
    private final EmergencyRepository emergencyRepository;
    private final RescueMissionRepository rescueMissionRepository;
    private final HospitalRepository hospitalRepository;
    private final UserRepository userRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("activeEmergencies", emergencyRepository.countByStatus("REPORTED")
                + emergencyRepository.countByStatus("ACKNOWLEDGED")
                + emergencyRepository.countByStatus("IN_PROGRESS"));
        stats.put("activeRescueMissions", rescueMissionRepository.findActiveMissions().size());
        stats.put("totalVolunteers", userRepository.countByRole(Role.VOLUNTEER));
        stats.put("totalHospitals", hospitalRepository.count());
        stats.put("availableBeds", hospitalRepository.findAll().stream()
                .mapToInt(hospital -> hospital.getBedsAvailable() == null ? 0 : hospital.getBedsAvailable())
                .sum());
        
        // Volunteer stats
        stats.put("activeVolunteers", volunteerRepository.countByStatus("ACTIVE"));
        stats.put("volunteersOnMission", volunteerRepository.countByStatus("ON_MISSION"));
        
        // Supply stats
        stats.put("suppliesInStock", supplyInventoryRepository.count());
        
        // AI stats
        var aiMetrics = aiMetricsRepository.findAll();
        if (!aiMetrics.isEmpty()) {
            var latest = aiMetrics.get(aiMetrics.size() - 1);
            stats.put("triageAccuracy", latest.getTriageAccuracy());
            stats.put("sosProcessed", latest.getSosProcessed());
            stats.put("duplicatesKilled", latest.getDuplicatesKilled());
        }
        
        // System health
        var systemHealth = systemHealthRepository.findAll();
        stats.put("servicesUp", systemHealth.stream().filter(s -> "UP".equals(s.getStatus())).count());
        stats.put("servicesDown", systemHealth.stream().filter(s -> "DOWN".equals(s.getStatus())).count());
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/volunteers")
    public ResponseEntity<?> getVolunteerMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalActive", volunteerRepository.countByStatus("ACTIVE"));
        metrics.put("onMission", volunteerRepository.countByStatus("ON_MISSION"));
        metrics.put("offDuty", volunteerRepository.countByStatus("OFF_DUTY"));
        metrics.put("allVolunteers", volunteerRepository.findAll());
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/supplies")
    public ResponseEntity<?> getSupplyMetrics() {
        return ResponseEntity.ok(supplyInventoryRepository.findAll());
    }

    @GetMapping("/ai/metrics")
    public ResponseEntity<?> getAIMetrics() {
        var metrics = aiMetricsRepository.findAll();
        if (metrics.isEmpty()) {
            return ResponseEntity.ok(new HashMap<>());
        }
        return ResponseEntity.ok(metrics.get(metrics.size() - 1));
    }

    @GetMapping("/health")
    public ResponseEntity<?> getSystemHealth() {
        return ResponseEntity.ok(systemHealthRepository.findAll());
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, String>>> getUsers() {
        return ResponseEntity.ok(userRepository.findAll().stream().map(this::toPublicUser).toList());
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<Map<String, String>> updateUserRole(
            @PathVariable String userId,
            @RequestParam String role,
            Authentication authentication) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("User not found"));
        Role newRole;
        try {
            newRole = Role.valueOf(role.toUpperCase());
        } catch (IllegalArgumentException exception) {
            throw new UnauthorizedException("Invalid role");
        }
        if (user.getEmail().equals(authentication.getName()) && newRole != Role.ADMIN) {
            throw new UnauthorizedException("You cannot remove your own administrator role");
        }
        user.setRole(newRole);
        if (newRole != Role.HOSPITAL) user.setHospitalId(null);
        userRepository.save(user);
        return ResponseEntity.ok(toPublicUser(user));
    }

    @PutMapping("/users/{userId}/hospital")
    public ResponseEntity<Map<String, String>> assignHospital(
            @PathVariable String userId,
            @RequestParam String hospitalId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("User not found"));
        if (user.getRole() != Role.HOSPITAL) {
            throw new UnauthorizedException("Assign a hospital only to an account with the HOSPITAL role");
        }
        if ("UNASSIGNED".equalsIgnoreCase(hospitalId)) {
            user.setHospitalId(null);
        } else {
            if (!hospitalRepository.existsById(hospitalId)) {
                throw new UnauthorizedException("Hospital record not found");
            }
            user.setHospitalId(hospitalId);
        }
        userRepository.save(user);
        return ResponseEntity.ok(toPublicUser(user));
    }
    private Map<String, String> toPublicUser(User user) {
        Map<String, String> result = new LinkedHashMap<>();
        result.put("id", user.getId());
        result.put("name", user.getName());
        result.put("email", user.getEmail());
        result.put("role", user.getRole().name());
        if (user.getHospitalId() != null) result.put("hospitalId", user.getHospitalId());
        return result;
    }
}

