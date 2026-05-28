package com.example.sentinelos.controller;

import com.example.sentinelos.repository.RescueMissionRepository;
import com.example.sentinelos.repository.HospitalDepartmentRepository;
import com.example.sentinelos.service.RescueMissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard/rescue")
@RequiredArgsConstructor
@CrossOrigin("*")
public class RescueTeamDashboardController {

    private final RescueMissionService rescueMissionService;
    private final RescueMissionRepository rescueMissionRepository;

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getRescueTeamMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        
        var activeMissions = rescueMissionRepository.findActiveMissions();
        metrics.put("activeMissions", activeMissions.size());
        
        // Calculate average ETA from active missions
        double avgEta = activeMissions.stream()
                .mapToInt(m -> m.getEta() != null ? m.getEta() : 0)
                .average()
                .orElse(0.0);
        metrics.put("averageETA", String.format("%.1f", avgEta) + "m");
        
        // Count completed missions today
        long completedToday = rescueMissionRepository.findByStatus("COMPLETED").stream()
                .filter(m -> m.getCompletedAt() != null && 
                        m.getCompletedAt().toLocalDate().equals(java.time.LocalDate.now()))
                .count();
        metrics.put("completedToday", completedToday);
        
        // Total units available (sum of ambulances from assigned hospitals)
        int unitsAvailable = 312; // Placeholder - would aggregate from hospitals
        metrics.put("unitsAvailable", unitsAvailable);
        
        metrics.put("missions", activeMissions);
        
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/missions/status/{status}")
    public ResponseEntity<?> getMissionsByStatus(@PathVariable String status) {
        var missions = rescueMissionRepository.findByStatus(status);
        Map<String, Object> response = new HashMap<>();
        response.put("status", status);
        response.put("count", missions.size());
        response.put("missions", missions);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/missions/priority/{priority}")
    public ResponseEntity<?> getMissionsByPriority(@PathVariable String priority) {
        var missions = rescueMissionRepository.findByPriority(priority);
        Map<String, Object> response = new HashMap<>();
        response.put("priority", priority);
        response.put("count", missions.size());
        response.put("missions", missions);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/missions/active")
    public ResponseEntity<?> getActiveMissions() {
        var missions = rescueMissionRepository.findActiveMissions();
        Map<String, Object> response = new HashMap<>();
        response.put("activeCount", missions.size());
        response.put("missions", missions);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getRescueAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        var allMissions = rescueMissionRepository.findAll();
        
        // Mission breakdown by status
        Map<String, Long> statusBreakdown = new HashMap<>();
        statusBreakdown.put("EN_ROUTE", allMissions.stream().filter(m -> "EN_ROUTE".equals(m.getStatus())).count());
        statusBreakdown.put("ASSIGNED", allMissions.stream().filter(m -> "ASSIGNED".equals(m.getStatus())).count());
        statusBreakdown.put("REACHED", allMissions.stream().filter(m -> "REACHED".equals(m.getStatus())).count());
        statusBreakdown.put("COMPLETED", allMissions.stream().filter(m -> "COMPLETED".equals(m.getStatus())).count());
        
        analytics.put("statusBreakdown", statusBreakdown);
        
        // Mission breakdown by type
        Map<String, Long> typeBreakdown = new HashMap<>();
        typeBreakdown.put("FLOOD", allMissions.stream().filter(m -> "FLOOD".equals(m.getMissionType())).count());
        typeBreakdown.put("FIRE", allMissions.stream().filter(m -> "FIRE".equals(m.getMissionType())).count());
        typeBreakdown.put("ACCIDENT", allMissions.stream().filter(m -> "ACCIDENT".equals(m.getMissionType())).count());
        typeBreakdown.put("OTHER", allMissions.stream().filter(m -> "OTHER".equals(m.getMissionType())).count());
        
        analytics.put("typeBreakdown", typeBreakdown);
        
        // Average metrics
        double avgVictims = allMissions.stream()
                .mapToInt(m -> m.getVictims() != null ? m.getVictims() : 0)
                .average()
                .orElse(0.0);
        analytics.put("averageVictims", Math.round(avgVictims * 100.0) / 100.0);
        
        return ResponseEntity.ok(analytics);
    }
}

