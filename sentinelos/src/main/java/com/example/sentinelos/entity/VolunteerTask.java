package com.example.sentinelos.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "volunteer_tasks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VolunteerTask {
    @Id
    private String id;
    private String title;
    private String location;
    private Integer required;
    private List<String> assigned;
    private String status; // TASK_CREATED, VOLUNTEER_ASSIGNED, ON_FIELD, TASK_COMPLETED
    private String description;
    private Integer priority; // 1-5, 1 is highest
    private String emergencyId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;
}

