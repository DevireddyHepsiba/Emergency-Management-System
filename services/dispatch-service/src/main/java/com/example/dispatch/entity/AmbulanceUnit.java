package com.example.dispatch.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "ambulance_units")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AmbulanceUnit {
    @Id
    private String id;
    private String callSign;
    private String type;
    private List<String> capabilities;
    private String status; // AVAILABLE, OFFERED, ASSIGNED, EN_ROUTE, OUT_OF_SERVICE
    private String hospitalId;
    private Double latitude;
    private Double longitude;
    private LocalDateTime locationUpdatedAt;
    private LocalDateTime updatedAt;
}
