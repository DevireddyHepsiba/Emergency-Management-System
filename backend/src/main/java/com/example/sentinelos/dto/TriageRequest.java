package com.example.sentinelos.dto;

import lombok.Data;
import java.util.List;

@Data
public class TriageRequest {
    private String priority;
    private List<String> requiredServices;
    private String requiredBedType;
    private Boolean needsAmbulance;
    private String ambulanceCapability;
    private String notes;
}
