package com.example.sentinelos.service;

import com.example.sentinelos.dto.VolunteerTaskRequest;
import com.example.sentinelos.dto.VolunteerTaskResponse;
import com.example.sentinelos.entity.VolunteerTask;
import com.example.sentinelos.exception.UnauthorizedException;
import com.example.sentinelos.repository.VolunteerTaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VolunteerTaskService {

    private final VolunteerTaskRepository volunteerTaskRepository;

    public VolunteerTaskResponse createTask(VolunteerTaskRequest request) {
        VolunteerTask task = VolunteerTask.builder()
                .title(request.getTitle())
                .location(request.getLocation())
                .required(request.getRequired() != null ? request.getRequired() : 1)
                .description(request.getDescription())
                .priority(request.getPriority() != null ? request.getPriority() : 3)
                .emergencyId(request.getEmergencyId())
                .assigned(new ArrayList<>())
                .status("TASK_CREATED")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        task = volunteerTaskRepository.save(task);

        return mapToResponse(task, "Volunteer task created successfully");
    }

    public VolunteerTaskResponse getTask(String taskId) {
        VolunteerTask task = volunteerTaskRepository.findById(taskId)
                .orElseThrow(() -> new UnauthorizedException("Task not found"));

        return mapToResponse(task, null);
    }

    public List<VolunteerTaskResponse> getAllTasks() {
        return volunteerTaskRepository.findAll().stream()
                .map(t -> mapToResponse(t, null))
                .collect(Collectors.toList());
    }

    public List<VolunteerTaskResponse> getTasksByStatus(String status) {
        return volunteerTaskRepository.findByStatus(status).stream()
                .map(t -> mapToResponse(t, null))
                .collect(Collectors.toList());
    }

    public List<VolunteerTaskResponse> getTasksByEmergency(String emergencyId) {
        return volunteerTaskRepository.findByEmergencyId(emergencyId).stream()
                .map(t -> mapToResponse(t, null))
                .collect(Collectors.toList());
    }

    public List<VolunteerTaskResponse> getTasksByLocation(String location) {
        return volunteerTaskRepository.findByLocationIgnoreCase(location).stream()
                .map(t -> mapToResponse(t, null))
                .collect(Collectors.toList());
    }

    public VolunteerTaskResponse assignVolunteer(String taskId, String volunteerId) {
        VolunteerTask task = volunteerTaskRepository.findById(taskId)
                .orElseThrow(() -> new UnauthorizedException("Task not found"));

        if (!task.getAssigned().contains(volunteerId)) {
            task.getAssigned().add(volunteerId);
        }

        if (task.getAssigned().size() >= task.getRequired()) {
            task.setStatus("VOLUNTEER_ASSIGNED");
        }

        task.setUpdatedAt(LocalDateTime.now());
        task = volunteerTaskRepository.save(task);

        return mapToResponse(task, "Volunteer assigned to task");
    }

    public VolunteerTaskResponse advanceTaskStatus(String taskId) {
        VolunteerTask task = volunteerTaskRepository.findById(taskId)
                .orElseThrow(() -> new UnauthorizedException("Task not found"));

        String currentStatus = task.getStatus();
        switch (currentStatus) {
            case "TASK_CREATED":
                task.setStatus("VOLUNTEER_ASSIGNED");
                break;
            case "VOLUNTEER_ASSIGNED":
                task.setStatus("ON_FIELD");
                break;
            case "ON_FIELD":
                task.setStatus("TASK_COMPLETED");
                task.setCompletedAt(LocalDateTime.now());
                break;
            default:
                throw new UnauthorizedException("Cannot advance status from: " + currentStatus);
        }

        task.setUpdatedAt(LocalDateTime.now());
        task = volunteerTaskRepository.save(task);

        return mapToResponse(task, "Task status advanced to " + task.getStatus());
    }

    public VolunteerTaskResponse updateTaskStatus(String taskId, String newStatus) {
        VolunteerTask task = volunteerTaskRepository.findById(taskId)
                .orElseThrow(() -> new UnauthorizedException("Task not found"));

        task.setStatus(newStatus);
        task.setUpdatedAt(LocalDateTime.now());
        if ("TASK_COMPLETED".equals(newStatus)) {
            task.setCompletedAt(LocalDateTime.now());
        }
        task = volunteerTaskRepository.save(task);

        return mapToResponse(task, "Task status updated to " + newStatus);
    }

    public VolunteerTaskResponse completeTask(String taskId) {
        return updateTaskStatus(taskId, "TASK_COMPLETED");
    }

    private VolunteerTaskResponse mapToResponse(VolunteerTask task, String message) {
        return VolunteerTaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .location(task.getLocation())
                .required(task.getRequired())
                .assigned(task.getAssigned())
                .status(task.getStatus())
                .description(task.getDescription())
                .priority(task.getPriority())
                .emergencyId(task.getEmergencyId())
                .message(message)
                .build();
    }
}

