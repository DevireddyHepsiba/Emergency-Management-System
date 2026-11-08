package com.example.emergency.controller;

import com.example.emergency.dto.EmergencyRequest;
import com.example.emergency.dto.EmergencyResponse;
import com.example.emergency.service.EmergencyService;
import com.example.emergency.dto.TriageRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergency")
@RequiredArgsConstructor
@CrossOrigin("*")
public class EmergencyController {

    private final EmergencyService emergencyService;

    @PostMapping("/report")
    public ResponseEntity<EmergencyResponse> reportEmergency(
            @RequestBody EmergencyRequest request,
            Authentication authentication) {
        
        // Allow anonymous reports (no authentication required for emergency)
        String userId = (authentication != null) ? authentication.getName() : "anonymous";
        EmergencyResponse response = emergencyService.reportEmergency(userId, userId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{emergencyId}")
    public ResponseEntity<EmergencyResponse> getEmergency(@PathVariable String emergencyId) {
        EmergencyResponse response = emergencyService.getEmergency(emergencyId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/my-reports")
    public ResponseEntity<List<EmergencyResponse>> getUserEmergencies(Authentication authentication) {
        String userId = authentication.getName(); // email
        List<EmergencyResponse> emergencies = emergencyService.getUserEmergencies(userId);
        return ResponseEntity.ok(emergencies);
    }

    @GetMapping("/all/reported")
    public ResponseEntity<List<EmergencyResponse>> getReportedEmergencies() {
        List<EmergencyResponse> emergencies = emergencyService.getReportedEmergencies();
        return ResponseEntity.ok(emergencies);
    }

    @GetMapping("/all")
    public ResponseEntity<List<EmergencyResponse>> getAllEmergencies() {
        return ResponseEntity.ok(emergencyService.getAllEmergencies());
    }

    @PutMapping("/{emergencyId}/triage")
    public ResponseEntity<EmergencyResponse> triageEmergency(
            @PathVariable String emergencyId,
            @RequestBody TriageRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(emergencyService.triageEmergency(emergencyId, request, authentication.getName()));
    }

    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<EmergencyResponse>> getEmergenciesByPriority(@PathVariable String priority) {
        List<EmergencyResponse> emergencies = emergencyService.getEmergenciesByPriority(priority.toUpperCase());
        return ResponseEntity.ok(emergencies);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<EmergencyResponse>> getEmergenciesByType(@PathVariable String type) {
        List<EmergencyResponse> emergencies = emergencyService.getEmergenciesByType(type.toUpperCase());
        return ResponseEntity.ok(emergencies);
    }

    @PutMapping("/{emergencyId}/acknowledge")
    public ResponseEntity<EmergencyResponse> acknowledgeEmergency(
            @PathVariable String emergencyId,
            Authentication authentication) {
        
        String responderUserId = authentication.getName();
        EmergencyResponse response = emergencyService.acknowledgeEmergency(emergencyId, responderUserId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{emergencyId}/status")
    public ResponseEntity<EmergencyResponse> updateEmergencyStatus(
            @PathVariable String emergencyId,
            @RequestParam String status) {
        
        EmergencyResponse response = emergencyService.updateEmergencyStatus(emergencyId, status.toUpperCase());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{emergencyId}")
    public ResponseEntity<?> deleteEmergency(@PathVariable String emergencyId) {
        emergencyService.deleteEmergency(emergencyId);
        return ResponseEntity.ok("Emergency report deleted");
    }
}

