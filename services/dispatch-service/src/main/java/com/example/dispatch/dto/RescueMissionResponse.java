package com.example.dispatch.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RescueMissionResponse {
    private String id;
    private String missionCode;
    private String emergencyId;
    private String title;
    private String description;
    private String location;
    private Double latitude;
    private Double longitude;
    private Integer victims;
    private String missionType;
    private String status;
    private String priority;
    private Integer eta;
    private Double distance;
    private String assignedTeam;
    private String assignedVehicle;
    private List<String> responders;
    private String hospitalId;
    private String message;
    private String ambulanceId;
    private Boolean teamAccepted;
    private Boolean hospitalAccepted;
    private String requiredBedType;
    private String teamAcceptedBy;
    private String hospitalAcceptedBy;
}

