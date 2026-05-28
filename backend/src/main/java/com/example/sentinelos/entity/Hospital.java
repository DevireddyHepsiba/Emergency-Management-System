package com.example.sentinelos.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

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
    private Integer icuAvailable;
    private Integer ambulances;
    private Double latitude;
    private Double longitude;
    private String status; // ALERT_RECEIVED, PREPARING, PATIENT_RECEIVED, TREATMENT_STARTED
    private String address;
    private String phone;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

