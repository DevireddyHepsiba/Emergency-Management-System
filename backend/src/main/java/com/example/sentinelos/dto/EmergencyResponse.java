package com.example.sentinelos.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyResponse {
    private String id;
    private String fullName;
    private String mobileNumber;
    private String emergencyType;
    private String description;
    private Double latitude;
    private Double longitude;
    private Integer victims;
    private Boolean hasMedicalEmergency;
    private List<String> mediaUrls;
    private String status;
    private String priority;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String message;
}

