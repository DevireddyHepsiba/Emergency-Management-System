package com.example.sentinelos.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HospitalResponse {
    private String id;
    private String name;
    private Integer bedsAvailable;
    private Integer icuAvailable;
    private Integer ambulances;
    private Double latitude;
    private Double longitude;
    private String status;
    private String address;
    private String phone;
    private Double distanceKm;
    private String message;
}

