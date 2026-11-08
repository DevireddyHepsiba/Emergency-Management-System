package com.example.dispatch.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "rescue_missions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RescueMission {
    @Id
    private String id;
    private String missionCode; // M-8291, M-8290, etc.
    private String emergencyId;
    private String title;
    private String description;
    private String location;
    private Double latitude;
    private Double longitude;
    private Integer victims;
    private String missionType; // FLOOD, FIRE, ACCIDENT, MEDICAL, EARTHQUAKE, BUILDING_COLLAPSE, WILDFIRE
    private String status; // EN_ROUTE, ASSIGNED, REACHED, IN_PROGRESS, COMPLETED
    private String priority; // CRITICAL, HIGH, MEDIUM, LOW
    
    private Integer eta; // ETA in minutes
    private Double distance; // Distance in KM
    private String assignedTeam;
    private String assignedVehicle;
    private String ambulanceId;
    private Boolean teamAccepted;
    private Boolean hospitalAccepted;
    private String teamAcceptedBy;
    private String hospitalAcceptedBy;
    private String requiredBedType;
    
    private List<String> responders;
    private String hospitalId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime reachedAt;
    private LocalDateTime completedAt;
    private LocalDateTime teamAcceptedAt;
    private LocalDateTime hospitalAcceptedAt;
    
    private String routePath; // Optimized route coordinates
}

