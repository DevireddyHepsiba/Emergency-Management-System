package com.example.emergency.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyRequest {
    private String fullName;
    private String mobileNumber;
    private String emergencyType;
    private String description;
    private Double latitude;
    private Double longitude;
    private Integer victims;
    private Boolean hasMedicalEmergency;
    private List<String> mediaUrls;
}

