package com.example.sentinelos.service;

import com.example.sentinelos.entity.Emergency;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;

/**
 * AI-powered response recommendation service
 * Provides intelligent response guidance and resource allocation recommendations
 */
@Service
@RequiredArgsConstructor
public class ResponseRecommendationService {

    /**
     * Get AI-powered response guidance for an emergency
     */
    public ResponseGuidance getResponseGuidance(Emergency emergency) {
        String responseType = determineResponseType(emergency);
        String urgencyLevel = determineUrgencyLevel(emergency);
        int estimatedResponseTime = estimateResponseTime(emergency, responseType);
        List<String> safetyPrecautions = generateSafetyPrecautions(emergency);
        
        String aiRecommendation = generateDetailedRecommendation(
            emergency, responseType, urgencyLevel, estimatedResponseTime
        );

        return new ResponseGuidance(
            responseType,
            urgencyLevel,
            estimatedResponseTime,
            safetyPrecautions,
            aiRecommendation
        );
    }

    /**
     * Determine optimal response type based on emergency characteristics
     */
    private String determineResponseType(Emergency emergency) {
        String type = emergency.getEmergencyType().toUpperCase();
        
        return switch(type) {
            case "MEDICAL" -> "AMBULANCE";
            case "FIRE" -> "FIRE_TRUCK";
            case "ACCIDENT" -> {
                Boolean medical = emergency.getHasMedicalEmergency();
                yield (medical != null && medical) ? "AMBULANCE_AND_POLICE" : "POLICE";
            }
            case "EARTHQUAKE", "FLOOD" -> "RESCUE_TEAM";
            default -> "MULTI_RESPONSE";
        };
    }

    /**
     * Determine urgency level based on multiple factors
     */
    private String determineUrgencyLevel(Emergency emergency) {
        int urgencyScore = 0;

        // Emergency type scoring
        String type = emergency.getEmergencyType().toUpperCase();
        urgencyScore += switch(type) {
            case "MEDICAL" -> 3;
            case "FIRE" -> 3;
            case "EARTHQUAKE" -> 4;
            case "ACCIDENT" -> 2;
            case "FLOOD" -> 1;
            default -> 1;
        };

        // Victim count
        Integer victims = emergency.getVictims();
        if (victims != null) {
            if (victims > 10) urgencyScore += 3;
            else if (victims > 5) urgencyScore += 2;
            else if (victims > 1) urgencyScore += 1;
        }

        // Medical flag
        if (emergency.getHasMedicalEmergency() != null && emergency.getHasMedicalEmergency()) {
            urgencyScore += 2;
        }

        // Description keywords
        String desc = emergency.getDescription();
        if (desc != null) {
            String lower = desc.toLowerCase();
            if (lower.contains("critical") || lower.contains("severe")) urgencyScore += 1;
            if (lower.contains("unconscious") || lower.contains("not breathing")) urgencyScore += 1;
        }

        return urgencyScore >= 7 ? "IMMEDIATE" : urgencyScore >= 5 ? "URGENT" : "STANDARD";
    }

    /**
     * Estimate response time based on emergency type and characteristics
     */
    private int estimateResponseTime(Emergency emergency, String responseType) {
        int baseTime = switch(responseType) {
            case "AMBULANCE" -> 8;
            case "FIRE_TRUCK" -> 7;
            case "POLICE" -> 6;
            case "RESCUE_TEAM" -> 15;
            case "AMBULANCE_AND_POLICE" -> 8;
            default -> 10;
        };

        // Adjust based on medical flag
        if (emergency.getHasMedicalEmergency() != null && emergency.getHasMedicalEmergency()) {
            baseTime -= 2;
        }

        // Minimum 3 minutes
        return Math.max(baseTime, 3);
    }

    /**
     * Generate context-specific safety precautions
     */
    private List<String> generateSafetyPrecautions(Emergency emergency) {
        List<String> precautions = new ArrayList<>();
        String type = emergency.getEmergencyType().toUpperCase();

        precautions.add("Clear the area of bystanders");
        
        switch(type) {
            case "FIRE":
                precautions.add("Move to safe distance (100+ meters)");
                precautions.add("Close windows and doors");
                precautions.add("Turn off gas supply if safe");
                break;
            case "MEDICAL":
                precautions.add("Keep patient calm and still");
                precautions.add("Monitor vital signs if trained");
                precautions.add("Do not move patient unless necessary");
                break;
            case "ACCIDENT":
                precautions.add("Turn off vehicle engines");
                precautions.add("Enable hazard lights");
                precautions.add("Move to safe location");
                break;
            case "FLOOD":
                precautions.add("Move to higher ground immediately");
                precautions.add("Avoid contaminated water");
                precautions.add("Do not drive through flooded areas");
                break;
            case "EARTHQUAKE":
                precautions.add("Take cover under sturdy furniture");
                precautions.add("Protect head and neck");
                precautions.add("Be prepared for aftershocks");
                break;
        }

        precautions.add("Call emergency number and provide location");
        return precautions;
    }

    /**
     * Generate detailed AI recommendation text
     */
    private String generateDetailedRecommendation(Emergency emergency, String responseType, String urgencyLevel, int estimatedTime) {
        String type = emergency.getEmergencyType();
        Integer victims = emergency.getVictims() != null ? emergency.getVictims() : 1;
        
        return String.format(
            "🚨 AI Recommendation: %s incident at (%.4f, %.4f) involving %d person(s). " +
            "Response Type: %s. Urgency: %s. ETA: %d minutes. " +
            "Recommended resources: Send %s immediately. " +
            "Priority: HIGH. Medical support: %s",
            type,
            emergency.getLatitude(),
            emergency.getLongitude(),
            victims,
            responseType,
            urgencyLevel,
            estimatedTime,
            responseType.replace("_", " "),
            emergency.getHasMedicalEmergency() != null && emergency.getHasMedicalEmergency() ? "REQUIRED" : "STANDBY"
        );
    }

    @Data
    @AllArgsConstructor
    public static class ResponseGuidance {
        private String recommendedResponseType;
        private String urgencyLevel;
        private int estimatedResponseTimeMinutes;
        private List<String> safetyPrecautions;
        private String aiRecommendation;
    }
}
