package com.example.sentinelos.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "ai_metrics")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIMetrics {
    @Id
    private String id;
    private Double triageAccuracy;
    private Long sosProcessed;
    private Long duplicatesKilled;
    private Integer translationLanguages; // 32 languages
    private Double severityPredictionAccuracy;
    private Long sosProcessedToday;
    private Double kafkaThroughput; // 1.2k/s
    private Double apiP95ResponseTime; // 84ms
    private Integer activeAlerts;
    private Integer totalUsers;
    private LocalDateTime lastUpdated;
}

