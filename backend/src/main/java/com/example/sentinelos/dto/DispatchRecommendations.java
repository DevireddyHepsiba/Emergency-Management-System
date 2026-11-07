package com.example.sentinelos.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DispatchRecommendations {
    private String emergencyId;
    private List<HospitalResponse> hospitals;
    private List<AmbulanceRecommendation> ambulances;
    private String notice;
}
