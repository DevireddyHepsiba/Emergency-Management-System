package com.example.volunteer.controller;

import com.example.volunteer.dto.VolunteerTaskRequest;
import com.example.volunteer.dto.VolunteerTaskResponse;
import com.example.volunteer.service.VolunteerTaskService;
import com.example.volunteer.repository.UserRepository;
import com.example.volunteer.entity.Role;
import com.example.volunteer.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/volunteer")
@RequiredArgsConstructor
@CrossOrigin("*")
public class VolunteerTaskController {

    private final VolunteerTaskService volunteerTaskService;
    private final UserRepository userRepository;

    @GetMapping("/task/volunteers")
    public ResponseEntity<List<Map<String, String>>> getVolunteerAccounts() {
        List<Map<String, String>> volunteers = userRepository.findByRole(Role.VOLUNTEER).stream()
                .map(this::toVolunteerSummary)
                .toList();
        return ResponseEntity.ok(volunteers);
    }

    private Map<String, String> toVolunteerSummary(User user) {
        return Map.of("id", user.getId(), "name", user.getName(), "email", user.getEmail());
    }

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
    public ResponseEntity<List<VolunteerTaskResponse>> getAllTasks(Authentication authentication) {
        boolean volunteer = authentication.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_VOLUNTEER".equals(authority.getAuthority()));
        if (volunteer) {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new com.example.volunteer.exception.UnauthorizedException("Volunteer account not found"));
            return ResponseEntity.ok(volunteerTaskService.getTasksAssignedTo(user.getId()));
        }
        return ResponseEntity.ok(volunteerTaskService.getAllTasks());
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
    public ResponseEntity<VolunteerTaskResponse> advanceTaskStatus(@PathVariable String id, Authentication authentication) {
        VolunteerTaskResponse response = volunteerTaskService.advanceTaskStatus(id, authentication.getName(), isCoordinator(authentication));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/task/{id}/status")
    public ResponseEntity<VolunteerTaskResponse> updateTaskStatus(
            @PathVariable String id,
            @RequestParam String status,
            Authentication authentication) {
        VolunteerTaskResponse response = volunteerTaskService.updateTaskStatus(id, status, authentication.getName(), isCoordinator(authentication));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/task/{id}/complete")
    public ResponseEntity<VolunteerTaskResponse> completeTask(@PathVariable String id, Authentication authentication) {
        VolunteerTaskResponse response = volunteerTaskService.completeTask(id, authentication.getName(), isCoordinator(authentication));
        return ResponseEntity.ok(response);
    }

    private boolean isCoordinator(Authentication authentication) {
        return authentication.getAuthorities().stream().anyMatch(authority ->
                "ROLE_ADMIN".equals(authority.getAuthority()) || "ROLE_NGO".equals(authority.getAuthority()));
    }
}

