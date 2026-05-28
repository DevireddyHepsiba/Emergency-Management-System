package com.example.sentinelos.controller;

import com.example.sentinelos.repository.VolunteerRepository;
import com.example.sentinelos.repository.SupplyInventoryRepository;
import com.example.sentinelos.repository.AIMetricsRepository;
import com.example.sentinelos.repository.SystemHealthRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
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

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
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
}

