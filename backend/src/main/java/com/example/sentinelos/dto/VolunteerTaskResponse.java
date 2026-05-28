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
public class VolunteerTaskResponse {
    private String id;
    private String title;
    private String location;
    private Integer required;
    private List<String> assigned;
    private String status;
    private String description;
    private Integer priority;
    private String emergencyId;
    private String message;
}

