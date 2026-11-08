package com.example.dispatch.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "emergencies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Emergency {
    @Id
    private String id;

    private String userId;

    private String fullName;

    private String mobileNumber;

    private String emergencyType; // FLOOD, FIRE, ACCIDENT, MEDICAL, EARTHQUAKE, OTHER

    private String description;

    private Double latitude;

    private Double longitude;

    private Integer victims;

    private Boolean hasMedicalEmergency;

    private List<String> mediaUrls; // Photos, videos, documents

    private String status; // REPORTED, ACKNOWLEDGED, IN_PROGRESS, RESOLVED

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String priority; // LOW, MEDIUM, HIGH, CRITICAL

    private String assignedTo; // User ID of responder

    private String notes;

    private List<String> requiredServices;

    private String requiredBedType;

    private String ambulanceCapability;

    private Boolean needsAmbulance;

    private String triageNotes;

    private String dispatcherId;

    private List<EmergencyStatusEvent> statusHistory;
}

