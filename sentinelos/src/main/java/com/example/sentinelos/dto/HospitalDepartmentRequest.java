package com.example.sentinelos.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HospitalDepartmentRequest {
    private String hospitalId;
    private String departmentName;
    private Integer beds;
    private Integer surgeryCapacity;
}

