package com.example.volunteer.service;

import com.example.volunteer.dto.VolunteerTaskRequest;
import com.example.volunteer.dto.VolunteerTaskResponse;
import com.example.volunteer.entity.VolunteerTask;
import com.example.volunteer.exception.UnauthorizedException;
import com.example.volunteer.repository.VolunteerTaskRepository;
import com.example.volunteer.repository.UserRepository;
import com.example.volunteer.entity.Role;
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
    private final UserRepository userRepository;

    public VolunteerTaskResponse createTask(VolunteerTaskRequest request) {
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            throw new UnauthorizedException("Task title is required");
        }
        if (request.getRequired() != null && request.getRequired() < 1) {
            throw new UnauthorizedException("At least one volunteer must be required");
        }
        if (request.getPriority() != null && (request.getPriority() < 1 || request.getPriority() > 5)) {
            throw new UnauthorizedException("Task priority must be between 1 and 5");
        }
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

    public List<VolunteerTaskResponse> getTasksAssignedTo(String userId) {
        return volunteerTaskRepository.findAll().stream()
                .filter(task -> task.getAssigned() != null && task.getAssigned().contains(userId))
                .map(task -> mapToResponse(task, null))
                .collect(Collectors.toList());
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

        var volunteer = userRepository.findById(volunteerId)
                .filter(user -> user.getRole() == Role.VOLUNTEER)
                .orElseThrow(() -> new UnauthorizedException("Volunteer account not found"));
        if (task.getAssigned() == null) task.setAssigned(new ArrayList<>());

        if (!task.getAssigned().contains(volunteer.getId())) {
            task.getAssigned().add(volunteer.getId());
        }

        int volunteersRequired = task.getRequired() == null ? 1 : task.getRequired();
        if (task.getAssigned().size() >= volunteersRequired) {
            task.setStatus("VOLUNTEER_ASSIGNED");
        }

        task.setUpdatedAt(LocalDateTime.now());
        task = volunteerTaskRepository.save(task);

        return mapToResponse(task, "Volunteer assigned to task");
    }

    public VolunteerTaskResponse advanceTaskStatus(String taskId, String actorEmail, boolean coordinator) {
        VolunteerTask task = volunteerTaskRepository.findById(taskId)
                .orElseThrow(() -> new UnauthorizedException("Task not found"));
        requireTaskAccess(task, actorEmail, coordinator);

        String currentStatus = task.getStatus();
        if ("TASK_CREATED".equals(currentStatus)
                && (task.getAssigned() == null
                || task.getAssigned().size() < (task.getRequired() == null ? 1 : task.getRequired()))) {
            throw new UnauthorizedException("Assign the required volunteers before starting the task");
        }
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

    public VolunteerTaskResponse updateTaskStatus(String taskId, String newStatus, String actorEmail, boolean coordinator) {
        VolunteerTask task = volunteerTaskRepository.findById(taskId)
                .orElseThrow(() -> new UnauthorizedException("Task not found"));
        requireTaskAccess(task, actorEmail, coordinator);

        boolean validTransition = switch (task.getStatus()) {
            case "TASK_CREATED" -> "VOLUNTEER_ASSIGNED".equals(newStatus)
                    && task.getAssigned() != null
                    && task.getAssigned().size() >= (task.getRequired() == null ? 1 : task.getRequired());
            case "VOLUNTEER_ASSIGNED" -> "ON_FIELD".equals(newStatus);
            case "ON_FIELD" -> "TASK_COMPLETED".equals(newStatus);
            default -> false;
        };
        if (!validTransition) {
            throw new UnauthorizedException("Invalid task status transition: " + task.getStatus() + " to " + newStatus);
        }

        task.setStatus(newStatus);
        task.setUpdatedAt(LocalDateTime.now());
        if ("TASK_COMPLETED".equals(newStatus)) {
            task.setCompletedAt(LocalDateTime.now());
        }
        task = volunteerTaskRepository.save(task);

        return mapToResponse(task, "Task status updated to " + newStatus);
    }

    public VolunteerTaskResponse completeTask(String taskId, String actorEmail, boolean coordinator) {
        return updateTaskStatus(taskId, "TASK_COMPLETED", actorEmail, coordinator);
    }

    private void requireTaskAccess(VolunteerTask task, String actorEmail, boolean coordinator) {
        if (coordinator) return;
        var actor = userRepository.findByEmail(actorEmail)
                .filter(user -> user.getRole() == Role.VOLUNTEER)
                .orElseThrow(() -> new UnauthorizedException("Volunteer account not found"));
        if (task.getAssigned() == null || !task.getAssigned().contains(actor.getId())) {
            throw new UnauthorizedException("You can only update tasks assigned to your account");
        }
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

