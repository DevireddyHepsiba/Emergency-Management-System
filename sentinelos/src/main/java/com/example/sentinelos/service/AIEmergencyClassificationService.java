package com.example.sentinelos.service;

import com.example.sentinelos.entity.Emergency;
import lombok.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AIEmergencyClassificationService {

    /**
     * Classify emergency using AI-powered analysis
     * Enhances priority assignment with confidence scoring
     */
    public AIClassificationResponse classifyEmergency(Emergency emergency) {
        String emergencyType = emergency.getEmergencyType();
        Integer victims = emergency.getVictims() != null ? emergency.getVictims() : 0;
        Boolean hasMedical = emergency.getHasMedicalEmergency() != null && emergency.getHasMedicalEmergency();
        
        // AI Logic: Enhance priority based on multiple factors
        String aiPriority = determineAIPriority(emergencyType, victims, hasMedical, emergency.getDescription());
        float confidence = calculateConfidence(emergencyType, victims, hasMedical);
        int severity = calculateSeverity(victims, hasMedical);
        
        return new AIClassificationResponse(
            emergencyType,
            aiPriority,
            confidence,
            severity,
            generateAIAnalysis(emergencyType, victims, hasMedical)
        );
    }

    private String determineAIPriority(String type, Integer victims, Boolean medical, String description) {
        int score = 0;
        
        // Type-based scoring
        score += switch(type) {
            case "MEDICAL" -> 3;
            case "FIRE" -> 3;
            case "EARTHQUAKE" -> 4;
            case "ACCIDENT" -> 2;
            case "FLOOD" -> 2;
            default -> 1;
        };
        
        // Victim count
        if (victims > 5) score += 3;
        else if (victims > 1) score += 2;
        else if (victims == 1) score += 1;
        
        // Medical flag
        if (medical) score += 2;
        
        // Description keywords
        if (description != null) {
            String lower = description.toLowerCase();
            if (lower.contains("critical") || lower.contains("severe")) score += 2;
            if (lower.contains("unconscious") || lower.contains("bleeding")) score += 1;
        }
        
        return score >= 7 ? "CRITICAL" : score >= 5 ? "HIGH" : score >= 3 ? "MEDIUM" : "LOW";
    }

    private float calculateConfidence(String type, Integer victims, Boolean medical) {
        float confidence = 0.7f;
        if (type != null && !type.isEmpty()) confidence += 0.1f;
        if (victims != null && victims > 0) confidence += 0.1f;
        if (medical) confidence += 0.1f;
        return Math.min(confidence, 0.99f);
    }

    private int calculateSeverity(Integer victims, Boolean medical) {
        int severity = 5;
        if (medical) severity += 2;
        if (victims != null && victims > 1) severity += 2;
        if (victims != null && victims > 5) severity += 1;
        return Math.min(severity, 10);
    }

    private String generateAIAnalysis(String type, Integer victims, Boolean medical) {
        StringBuilder analysis = new StringBuilder("AI Classification: ");
        analysis.append(type).append(" type emergency");
        if (victims != null && victims > 1) {
            analysis.append(" affecting ").append(victims).append(" individuals");
        }
        if (medical) {
            analysis.append(" with medical complications");
        }
        analysis.append(". Priority classification based on multi-factor analysis.");
        return analysis.toString();
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AIClassificationResponse {
        private String originalType;
        private String aiPriority;
        private float confidence;
        private int severityScore;
        private String aiAnalysis;
    }
}
