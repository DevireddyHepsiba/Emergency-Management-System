package com.example.volunteer.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "volunteers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Volunteer {
    @Id
    private String id;
    private String name;
    private String email;
    private String phone;
    private String ngoOrganization;
    private String status; // ACTIVE, INACTIVE, ON_MISSION, OFF_DUTY
    private String specialization; // MEDICAL, LOGISTICS, SEARCH_RESCUE, COUNSELING, COMMUNICATIONS
    private Double latitude;
    private Double longitude;
    private Integer assignedTasks;
    private Integer completedTasks;
    private Double rating;
    private LocalDateTime availableSince;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

