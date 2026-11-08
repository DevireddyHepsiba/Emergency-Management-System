package com.example.volunteer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VolunteerTaskRequest {
    private String title;
    private String location;
    private Integer required;
    private String description;
    private Integer priority;
    private String emergencyId;
}

