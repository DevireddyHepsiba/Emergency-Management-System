package com.example.sentinelos.controller;

import com.example.sentinelos.dto.VolunteerTaskRequest;
import com.example.sentinelos.dto.VolunteerTaskResponse;
import com.example.sentinelos.service.VolunteerTaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/volunteer")
@RequiredArgsConstructor
@CrossOrigin("*")
public class VolunteerTaskController {

    private final VolunteerTaskService volunteerTaskService;

    @PostMapping("/task/create")
    public ResponseEntity<VolunteerTaskResponse> createTask(@RequestBody VolunteerTaskRequest request) {
        VolunteerTaskResponse response = volunteerTaskService.createTask(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/task/{id}")
    public ResponseEntity<VolunteerTaskResponse> getTask(@PathVariable String id) {
        VolunteerTaskResponse response = volunteerTaskService.getTask(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/task/all")
    public ResponseEntity<List<VolunteerTaskResponse>> getAllTasks() {
        List<VolunteerTaskResponse> tasks = volunteerTaskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/task/status/{status}")
    public ResponseEntity<List<VolunteerTaskResponse>> getTasksByStatus(@PathVariable String status) {
        List<VolunteerTaskResponse> tasks = volunteerTaskService.getTasksByStatus(status);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/task/emergency/{emergencyId}")
    public ResponseEntity<List<VolunteerTaskResponse>> getTasksByEmergency(@PathVariable String emergencyId) {
        List<VolunteerTaskResponse> tasks = volunteerTaskService.getTasksByEmergency(emergencyId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/task/location/{location}")
    public ResponseEntity<List<VolunteerTaskResponse>> getTasksByLocation(@PathVariable String location) {
        List<VolunteerTaskResponse> tasks = volunteerTaskService.getTasksByLocation(location);
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/task/{id}/assign/{volunteerId}")
    public ResponseEntity<VolunteerTaskResponse> assignVolunteer(
            @PathVariable String id,
            @PathVariable String volunteerId) {
        VolunteerTaskResponse response = volunteerTaskService.assignVolunteer(id, volunteerId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/task/{id}/advance")
    public ResponseEntity<VolunteerTaskResponse> advanceTaskStatus(@PathVariable String id) {
        VolunteerTaskResponse response = volunteerTaskService.advanceTaskStatus(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/task/{id}/status")
    public ResponseEntity<VolunteerTaskResponse> updateTaskStatus(
            @PathVariable String id,
            @RequestParam String status) {
        VolunteerTaskResponse response = volunteerTaskService.updateTaskStatus(id, status);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/task/{id}/complete")
    public ResponseEntity<VolunteerTaskResponse> completeTask(@PathVariable String id) {
        VolunteerTaskResponse response = volunteerTaskService.completeTask(id);
        return ResponseEntity.ok(response);
    }
}

