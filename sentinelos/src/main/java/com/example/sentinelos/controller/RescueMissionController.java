package com.example.sentinelos.controller;

import com.example.sentinelos.dto.RescueMissionRequest;
import com.example.sentinelos.dto.RescueMissionResponse;
import com.example.sentinelos.service.RescueMissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rescue/mission")
@RequiredArgsConstructor
@CrossOrigin("*")
public class RescueMissionController {

    private final RescueMissionService rescueMissionService;

    @PostMapping("/create")
    public ResponseEntity<RescueMissionResponse> createMission(@RequestBody RescueMissionRequest request) {
        RescueMissionResponse response = rescueMissionService.createMission(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/active")
    public ResponseEntity<List<RescueMissionResponse>> getActiveMissions() {
        List<RescueMissionResponse> missions = rescueMissionService.getActiveMissions();
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
    public ResponseEntity<List<RescueMissionResponse>> getMissionsByHospital(@PathVariable String hospitalId) {
        List<RescueMissionResponse> missions = rescueMissionService.getMissionsByHospital(hospitalId);
        return ResponseEntity.ok(missions);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<RescueMissionResponse> updateMissionStatus(
            @PathVariable String id,
            @RequestParam String status) {
        RescueMissionResponse response = rescueMissionService.updateMissionStatus(id, status);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/eta")
    public ResponseEntity<RescueMissionResponse> updateMissionETA(
            @PathVariable String id,
            @RequestParam Integer eta) {
        RescueMissionResponse response = rescueMissionService.updateMissionETA(id, eta);
        return ResponseEntity.ok(response);
    }
}

