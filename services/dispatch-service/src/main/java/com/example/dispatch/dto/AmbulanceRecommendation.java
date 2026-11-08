package com.example.dispatch.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AmbulanceRecommendation {
    private String id;
    private String callSign;
    private String type;
    private List<String> capabilities;
    private String status;
    private String hospitalId;
    private Double latitude;
    private Double longitude;
    private Double distanceKm;
    private LocalDateTime locationUpdatedAt;
    private LocalDateTime updatedAt;
}
