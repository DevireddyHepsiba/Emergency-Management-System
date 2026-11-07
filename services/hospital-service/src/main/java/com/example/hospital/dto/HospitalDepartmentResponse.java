package com.example.sentinelos.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HospitalDepartmentResponse {
    private String id;
    private String hospitalId;
    private String departmentName;
    private Integer beds;
    private Integer occupiedBeds;
    private Double occupancyPercentage;
    private Integer surgeryCapacity;
    private Long traumas;
    private Long respiratory;
    private Long cardiac;
    private Long burns;
    private Long other;
    private String message;
}

