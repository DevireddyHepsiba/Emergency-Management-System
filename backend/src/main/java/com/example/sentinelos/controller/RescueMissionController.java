package com.example.sentinelos.controller;

import com.example.sentinelos.dto.RescueMissionRequest;
import com.example.sentinelos.dto.RescueMissionResponse;
import com.example.sentinelos.entity.Role;
import com.example.sentinelos.entity.User;
import com.example.sentinelos.exception.UnauthorizedException;
import com.example.sentinelos.repository.UserRepository;
import com.example.sentinelos.service.RescueMissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/rescue/mission")
@RequiredArgsConstructor
@CrossOrigin("*")
public class RescueMissionController {

    private final RescueMissionService rescueMissionService;
    private final UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<RescueMissionResponse> createMission(@RequestBody RescueMissionRequest request) {
        RescueMissionResponse response = rescueMissionService.createMission(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/active")
    public ResponseEntity<List<RescueMissionResponse>> getActiveMissions(Authentication authentication) {
        List<RescueMissionResponse> missions = rescueMissionService.getActiveMissions();
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user != null && user.getRole() == Role.HOSPITAL) {
            String hospitalId = user.getHospitalId();
            missions = missions.stream().filter(mission -> hospitalId != null && Objects.equals(hospitalId, mission.getHospitalId())).toList();
        }
        return ResponseEntity.ok(missions);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<RescueMissionResponse>> getMissionsByStatus(@PathVariable String status) {
        List<RescueMissionResponse> missions = rescueMissionService.getMissionsByStatus(status);
        return ResponseEntity.ok(missions);
    }

    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<RescueMissionResponse>> getMissionsByPriority(@PathVariable String priority) {
        List<RescueMissionResponse> missions = rescueMissionService.getMissionsByPriority(priority);
        return ResponseEntity.ok(missions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RescueMissionResponse> getMissionById(@PathVariable String id) {
        RescueMissionResponse mission = rescueMissionService.getMissionById(id);
        return ResponseEntity.ok(mission);
    }

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<RescueMissionResponse>> getMissionsByHospital(@PathVariable String hospitalId, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user != null && user.getRole() == Role.HOSPITAL && !hospitalId.equals(user.getHospitalId())) {
            throw new UnauthorizedException("You can view missions referred to your assigned hospital only");
        }
        return ResponseEntity.ok(rescueMissionService.getMissionsByHospital(hospitalId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<RescueMissionResponse> updateMissionStatus(
            @PathVariable String id,
            @RequestParam String status) {
        RescueMissionResponse response = rescueMissionService.updateMissionStatus(id, status);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/team-response")
    public ResponseEntity<RescueMissionResponse> teamResponse(
            @PathVariable String id,
            @RequestParam boolean accepted,
            Authentication authentication) {
        return ResponseEntity.ok(rescueMissionService.recordAcceptance(id, "TEAM", accepted, authentication.getName()));
    }

    @PostMapping("/{id}/hospital-response")
    public ResponseEntity<RescueMissionResponse> hospitalResponse(
            @PathVariable String id,
            @RequestParam boolean accepted,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UnauthorizedException("Hospital account not found"));
        RescueMissionResponse mission = rescueMissionService.getMissionById(id);
        if (user.getRole() != Role.ADMIN && (user.getRole() != Role.HOSPITAL || !mission.getHospitalId().equals(user.getHospitalId()))) {
            throw new UnauthorizedException("You can respond only to referrals for your assigned hospital");
        }
        return ResponseEntity.ok(rescueMissionService.recordAcceptance(id, "HOSPITAL", accepted, authentication.getName()));
    }

    @PutMapping("/{id}/eta")
    public ResponseEntity<RescueMissionResponse> updateMissionETA(
            @PathVariable String id,
            @RequestParam Integer eta) {
        RescueMissionResponse response = rescueMissionService.updateMissionETA(id, eta);
        return ResponseEntity.ok(response);
    }
}

