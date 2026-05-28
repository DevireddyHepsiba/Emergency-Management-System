package com.example.sentinelos.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "system_health")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemHealth {
    @Id
    private String id;
    private String serviceName;
    private String status; // UP, DOWN, DEGRADED
    private Double uptime; // percentage
    private Double cpuUsage;
    private Double memoryUsage;
    private Long requestsPerSecond;
    private Double averageResponseTime;
    private Integer errorRate;
    private LocalDateTime lastHealthCheck;
    private LocalDateTime createdAt;
}

