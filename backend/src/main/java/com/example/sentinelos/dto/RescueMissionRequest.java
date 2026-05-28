package com.example.sentinelos.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RescueMissionRequest {
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
}

