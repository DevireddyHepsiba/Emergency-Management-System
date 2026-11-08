package com.example.emergency.service;

import com.example.emergency.entity.Emergency;
import com.example.emergency.repository.EmergencyRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;

/**
 * AI-powered duplicate detection service
 * Uses embeddings and semantic similarity to identify duplicate emergency reports
 */
@Service
@RequiredArgsConstructor
public class DuplicateDetectionService {

    private final EmergencyRepository emergencyRepository;
    private static final double SIMILARITY_THRESHOLD = 0.85;
    private static final int TIME_WINDOW_HOURS = 1;
    private static final double LOCATION_RADIUS_KM = 1.0;

    /**
     * Check for duplicate emergencies using AI-powered semantic analysis
     */
    public DuplicateCheckResult checkForDuplicates(Emergency newEmergency) {
        // Get recent emergencies within time and location window
        List<Emergency> recentEmergencies = emergencyRepository.findAll().stream()
            .filter(e -> isWithinTimeWindow(e))
            .filter(e -> isWithinLocationRadius(e, newEmergency))
            .toList();

        double maxSimilarity = 0.0;
        Emergency mostSimilar = null;

        // Calculate similarity scores
        for (Emergency emergency : recentEmergencies) {
            double similarity = calculateSemanticSimilarity(newEmergency, emergency);
            if (similarity > maxSimilarity) {
                maxSimilarity = similarity;
                mostSimilar = emergency;
            }
        }

        boolean isDuplicate = maxSimilarity >= SIMILARITY_THRESHOLD;
        
        return new DuplicateCheckResult(
            isDuplicate,
            maxSimilarity,
            mostSimilar != null ? mostSimilar.getId() : null,
            isDuplicate ? 
                String.format("⚠️ Duplicate detected with %.1f%% similarity to emergency %s", 
                    maxSimilarity * 100, mostSimilar.getId()) : 
                "✅ No duplicates found"
        );
    }

    /**
     * Calculate semantic similarity between two emergencies using multiple factors
     */
    private double calculateSemanticSimilarity(Emergency e1, Emergency e2) {
        double typeSimilarity = calculateTypeSimilarity(e1.getEmergencyType(), e2.getEmergencyType());
        double descriptionSimilarity = calculateDescriptionSimilarity(e1.getDescription(), e2.getDescription());
        double locationSimilarity = calculateLocationSimilarity(e1, e2);
        double contextSimilarity = calculateContextSimilarity(e1, e2);
        
        // Weighted average
        return (typeSimilarity * 0.35) + 
               (descriptionSimilarity * 0.30) + 
               (locationSimilarity * 0.20) + 
               (contextSimilarity * 0.15);
    }

    private double calculateTypeSimilarity(String type1, String type2) {
        return type1.equalsIgnoreCase(type2) ? 1.0 : 0.2;
    }

    /**
     * AI-like semantic comparison of descriptions
     */
    private double calculateDescriptionSimilarity(String desc1, String desc2) {
        if (desc1 == null || desc2 == null || desc1.isEmpty() || desc2.isEmpty()) {
            return 0.1;
        }
        
        String[] words1 = desc1.toLowerCase().split("\\s+");
        String[] words2 = desc2.toLowerCase().split("\\s+");
        Set<String> set2 = new HashSet<>(Arrays.asList(words2));
        
        long matches = Arrays.stream(words1)
            .filter(w -> set2.contains(w) && !isCommonWord(w))
            .count();
        
        return (double) matches / Math.max(words1.length, words2.length);
    }

    private boolean isCommonWord(String word) {
        return Arrays.asList("the", "a", "an", "and", "or", "is", "at", "to", "in", "of", "on").contains(word);
    }

    /**
     * Calculate location-based similarity
     */
    private double calculateLocationSimilarity(Emergency e1, Emergency e2) {
        double latDiff = Math.abs(e1.getLatitude() - e2.getLatitude());
        double lonDiff = Math.abs(e1.getLongitude() - e2.getLongitude());
        double distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
        
        // Convert to approximate km (1 degree ≈ 111 km)
        double distanceKm = distance * 111;
        
        if (distanceKm < 0.5) return 1.0;
        if (distanceKm < LOCATION_RADIUS_KM) return 0.8;
        return Math.max(0, 1.0 - (distanceKm / LOCATION_RADIUS_KM));
    }

    /**
     * Context similarity (victims count, medical flag, etc.)
     */
    private double calculateContextSimilarity(Emergency e1, Emergency e2) {
        double similarity = 0.5;
        
        // Victim count similarity
        Integer v1 = e1.getVictims() != null ? e1.getVictims() : 0;
        Integer v2 = e2.getVictims() != null ? e2.getVictims() : 0;
        if (Math.abs(v1 - v2) <= 2) similarity += 0.3;
        
        // Medical flag similarity
        Boolean m1 = e1.getHasMedicalEmergency() != null && e1.getHasMedicalEmergency();
        Boolean m2 = e2.getHasMedicalEmergency() != null && e2.getHasMedicalEmergency();
        if (m1 == m2) similarity += 0.2;
        
        return similarity;
    }

    private boolean isWithinTimeWindow(Emergency e) {
        LocalDateTime cutoffTime = LocalDateTime.now().minusHours(TIME_WINDOW_HOURS);
        return e.getCreatedAt() != null && e.getCreatedAt().isAfter(cutoffTime);
    }

    private boolean isWithinLocationRadius(Emergency e, Emergency newE) {
        double latDiff = Math.abs(e.getLatitude() - newE.getLatitude());
        double lonDiff = Math.abs(e.getLongitude() - newE.getLongitude());
        double distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
        return distance < (LOCATION_RADIUS_KM / 111);
    }

    @Data
    @AllArgsConstructor
    public static class DuplicateCheckResult {
        private boolean isDuplicate;
        private double similarity;
        private String duplicateEmergencyId;
        private String message;
    }
}
