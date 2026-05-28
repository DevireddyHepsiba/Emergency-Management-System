package com.example.sentinelos.dto;

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
    private String title;
    private String location;
    private Integer victims;
    private String status;
    private String priority;
    private Integer eta;
    private Double distance;
    private String assignedTeam;
    private List<String> responders;
    private String hospitalId;
    private String message;
}

