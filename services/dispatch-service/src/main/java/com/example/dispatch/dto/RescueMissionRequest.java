package com.example.dispatch.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RescueMissionRequest {
    private String emergencyId;
    private String title;
    private String description;
    private String location;
    private Double latitude;
    private Double longitude;
    private Integer victims;
    private String missionType;
    private String priority;
    private String assignedTeam;
    private String hospitalId;
    private String ambulanceId;
    private String requiredBedType;
}

