package com.example.hospital.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "hospitals")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Hospital {
    @Id
    private String id;
    private String name;
    private Integer bedsAvailable;
    private Integer cardiacBedsAvailable;
    private Integer icuAvailable;
    private Integer ambulances;
    private Double latitude;
    private Double longitude;
    private String status; // ALERT_RECEIVED, PREPARING, PATIENT_RECEIVED, TREATMENT_STARTED
    private String address;
    private String phone;
    private List<String> services;
    private LocalDateTime capacityUpdatedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

