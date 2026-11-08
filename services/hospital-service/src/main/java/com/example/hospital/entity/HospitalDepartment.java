package com.example.hospital.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "hospital_departments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HospitalDepartment {
    @Id
    private String id;
    private String hospitalId;
    private String departmentName; // Emergency Room, ICU, Trauma Bay, Surgery, General Ward, Pediatrics
    private Integer beds;
    private Integer occupiedBeds;
    private Integer surgeryCapacity;
    private Double occupancyPercentage;
    
    private List<IncomingPatient> incomingPatients;
    private List<PatientQueue> patientQueue;
    
    private Long traumas; // Last 24h
    private Long respiratory;
    private Long cardiac;
    private Long burns;
    private Long other;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class IncomingPatient {
    private String patientId;
    private String condition; // Trauma, Respiratory, Cardiac, Burn, Other
    private String severity; // CRITICAL, HIGH, MEDIUM, LOW
    private Integer etaMinutes;
    private String ambulanceId;
    private LocalDateTime estimatedArrival;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class PatientQueue {
    private String patientId;
    private String patientType; // TRAUMA, RESP, CARDIAC, BURN, OTHER
    private Integer waitTimeMinutes;
    private String priority; // CRITICAL, HIGH, MEDIUM, LOW
    private LocalDateTime arrivedAt;
}

