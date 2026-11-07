package com.example.sentinelos.service;

import com.example.sentinelos.entity.Emergency;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

/**
 * ML-powered volunteer assignment service
 * Intelligently matches volunteers to tasks based on location, skills, and availability
 */
@Service
@RequiredArgsConstructor
public class SmartVolunteerAssignmentService {

    /**
     * Recommend best volunteers for task assignment using ML algorithm
     */
    public AssignmentRecommendation recommendVolunteers(Emergency emergency, List<VolunteerProfile> availableVolunteers, int maxRecommendations) {
        if (availableVolunteers.isEmpty()) {
            return new AssignmentRecommendation(
                new ArrayList<>(),
                "No volunteers available",
                false,
                "0.0"
            );
        }

        // Score all volunteers
        List<ScoredVolunteer> scoredVolunteers = availableVolunteers.stream()
            .map(v -> new ScoredVolunteer(
                v.getId(),
                calculateVolunteerScore(v, emergency),
                v
            ))
            .sorted(Comparator.comparingDouble((ScoredVolunteer sv) -> sv.score).reversed())
            .collect(Collectors.toList());

        // Get top N recommendations
        List<String> recommendedIds = scoredVolunteers.stream()
            .limit(maxRecommendations)
            .map(sv -> sv.volunteerId)
            .collect(Collectors.toList());

        double averageScore = scoredVolunteers.stream()
            .limit(maxRecommendations)
            .mapToDouble(sv -> sv.score)
            .average()
            .orElse(0.0);

        String reasoning = generateRecommendationReasoning(scoredVolunteers.stream().limit(maxRecommendations).collect(Collectors.toList()));

        return new AssignmentRecommendation(
            recommendedIds,
            reasoning,
            true,
            String.format("%.2f", averageScore)
        );
    }

    /**
     * Calculate comprehensive volunteer score using multiple AI factors
     */
    private double calculateVolunteerScore(VolunteerProfile volunteer, Emergency emergency) {
        double score = 0.0;

        // Location-based scoring (weight: 0.40)
        double proximityScore = calculateProximityScore(volunteer, emergency);
        score += proximityScore * 0.40;

        // Skills matching (weight: 0.30)
        double skillsScore = calculateSkillsScore(volunteer, emergency);
        score += skillsScore * 0.30;

        // Availability scoring (weight: 0.20)
        double availabilityScore = volunteer.isAvailable() ? 1.0 : 0.0;
        score += availabilityScore * 0.20;

        // Experience level (weight: 0.10)
        double experienceScore = Math.min(volunteer.getExperienceLevel() / 10.0, 1.0);
        score += experienceScore * 0.10;

        return score;
    }

    /**
     * Calculate proximity score (closer = better)
     */
    private double calculateProximityScore(VolunteerProfile volunteer, Emergency emergency) {
        double latDiff = Math.abs(volunteer.getLatitude() - emergency.getLatitude());
        double lonDiff = Math.abs(volunteer.getLongitude() - emergency.getLongitude());
        double distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
        
        // Distance in approximate km
        double distanceKm = distance * 111;
        
        if (distanceKm < 1) return 1.0;
        if (distanceKm < 5) return 0.8;
        if (distanceKm < 10) return 0.6;
        return Math.max(0.1, 1.0 - (distanceKm / 50.0));
    }

    /**
     * Calculate skills match score
     */
    private double calculateSkillsScore(VolunteerProfile volunteer, Emergency emergency) {
        if (volunteer.getSkills() == null || volunteer.getSkills().isEmpty()) {
            return 0.5;
        }

        String skills = volunteer.getSkills().toLowerCase();
        String emergencyType = emergency.getEmergencyType().toLowerCase();

        // Skill to emergency type mapping
        Map<String, List<String>> skillMapping = new HashMap<>();
        skillMapping.put("medical", Arrays.asList("medical", "first-aid", "nurse", "doctor"));
        skillMapping.put("fire", Arrays.asList("fire", "rescue", "hazmat"));
        skillMapping.put("accident", Arrays.asList("rescue", "first-aid", "driving"));
        skillMapping.put("flood", Arrays.asList("swimming", "rescue", "diving"));
        skillMapping.put("earthquake", Arrays.asList("rescue", "construction", "engineering"));

        List<String> relevantSkills = skillMapping.getOrDefault(emergencyType, Arrays.asList("rescue"));
        
        long matches = relevantSkills.stream()
            .filter(skills::contains)
            .count();
        
        return Math.min((double) matches / relevantSkills.size(), 1.0);
    }

    private String generateRecommendationReasoning(List<ScoredVolunteer> topVolunteers) {
        if (topVolunteers.isEmpty()) {
            return "No suitable volunteers found";
        }

        StringBuilder reasoning = new StringBuilder("ML-powered volunteer recommendation: ");
        for (int i = 0; i < topVolunteers.size(); i++) {
            ScoredVolunteer sv = topVolunteers.get(i);
            reasoning.append(String.format("(#%d) %s (score: %.2f)", 
                i + 1, sv.volunteerId, sv.score));
            if (i < topVolunteers.size() - 1) reasoning.append(" | ");
        }
        return reasoning.toString();
    }

    @Data
    public static class VolunteerProfile {
        private String id;
        private double latitude;
        private double longitude;
        private String skills;
        private boolean available;
        private int experienceLevel; // 1-10

        public VolunteerProfile(String id, double lat, double lon, String skills, boolean available, int exp) {
            this.id = id;
            this.latitude = lat;
            this.longitude = lon;
            this.skills = skills;
            this.available = available;
            this.experienceLevel = exp;
        }

        public String getId() {
            return id;
        }
    }

    @Data
    @AllArgsConstructor
    public static class AssignmentRecommendation {
        private List<String> recommendedVolunteerIds;
        private String reasoning;
        private boolean isAIPowered;
        private String confidenceScore;
    }

    @Data
    private static class ScoredVolunteer {
        private String volunteerId;
        private double score;
        private VolunteerProfile profile;

        public ScoredVolunteer(String volunteerId, double score, VolunteerProfile profile) {
            this.volunteerId = volunteerId;
            this.score = score;
            this.profile = profile;
        }
    }
}
