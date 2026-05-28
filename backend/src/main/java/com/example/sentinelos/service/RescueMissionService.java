package com.example.sentinelos.service;

import com.example.sentinelos.dto.RescueMissionRequest;
import com.example.sentinelos.dto.RescueMissionResponse;
import com.example.sentinelos.entity.RescueMission;
import com.example.sentinelos.exception.UnauthorizedException;
import com.example.sentinelos.repository.RescueMissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RescueMissionService {

    private final RescueMissionRepository rescueMissionRepository;
    private static int missionCounter = 8290;

    public RescueMissionResponse createMission(RescueMissionRequest request) {
        String missionCode = "M-" + (++missionCounter);
        
        // Calculate ETA and distance
        Integer eta = calculateETA(request.getLatitude(), request.getLongitude());
        Double distance = calculateDistance(request.getLatitude(), request.getLongitude());

        RescueMission mission = RescueMission.builder()
                .missionCode(missionCode)
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .victims(request.getVictims())
                .missionType(request.getMissionType())
                .priority(request.getPriority())
                .status("ASSIGNED")
                .eta(eta)
                .distance(distance)
                .assignedTeam(request.getAssignedTeam())
                .hospitalId(request.getHospitalId())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        mission = rescueMissionRepository.save(mission);

        return mapToResponse(mission, "Mission created: " + missionCode);
    }

    public List<RescueMissionResponse> getActiveMissions() {
        return rescueMissionRepository.findActiveMissions().stream()
                .map(m -> mapToResponse(m, null))
                .collect(Collectors.toList());
    }

    public List<RescueMissionResponse> getMissionsByStatus(String status) {
        return rescueMissionRepository.findByStatus(status).stream()
                .map(m -> mapToResponse(m, null))
                .collect(Collectors.toList());
    }

    public RescueMissionResponse getMissionById(String missionId) {
        RescueMission mission = rescueMissionRepository.findById(missionId)
                .orElseThrow(() -> new UnauthorizedException("Mission not found"));
        return mapToResponse(mission, null);
    }

    public RescueMissionResponse updateMissionStatus(String missionId, String newStatus) {
        RescueMission mission = rescueMissionRepository.findById(missionId)
                .orElseThrow(() -> new UnauthorizedException("Mission not found"));

        mission.setStatus(newStatus);
        mission.setUpdatedAt(LocalDateTime.now());
        
        if ("REACHED".equals(newStatus)) {
            mission.setReachedAt(LocalDateTime.now());
        } else if ("COMPLETED".equals(newStatus)) {
            mission.setCompletedAt(LocalDateTime.now());
        }

        mission = rescueMissionRepository.save(mission);
        return mapToResponse(mission, "Mission status updated to " + newStatus);
    }

    public RescueMissionResponse updateMissionETA(String missionId, Integer newETA) {
        RescueMission mission = rescueMissionRepository.findById(missionId)
                .orElseThrow(() -> new UnauthorizedException("Mission not found"));

        mission.setEta(newETA);
        mission.setUpdatedAt(LocalDateTime.now());
        mission = rescueMissionRepository.save(mission);

        return mapToResponse(mission, "ETA updated to " + newETA + " minutes");
    }

    public List<RescueMissionResponse> getMissionsByPriority(String priority) {
        return rescueMissionRepository.findByPriority(priority).stream()
                .map(m -> mapToResponse(m, null))
                .collect(Collectors.toList());
    }

    public List<RescueMissionResponse> getMissionsByHospital(String hospitalId) {
        return rescueMissionRepository.findByHospitalId(hospitalId).stream()
                .map(m -> mapToResponse(m, null))
                .collect(Collectors.toList());
    }

    // Calculate ETA based on distance (simple heuristic: assume 60 km/h average speed)
    private Integer calculateETA(Double latitude, Double longitude) {
        // Simplified: return random ETA between 4-9 minutes
        double random = Math.random() * 5 + 4;
        return (int) random;
    }

    // Calculate distance (Haversine formula from reference point)
    private Double calculateDistance(Double lat, Double lon) {
        // Reference point: NYC (40.7128, -74.0060)
        double refLat = 40.7128;
        double refLon = -74.0060;
        
        final int R = 6371; // Earth radius in km
        double dLat = Math.toRadians(lat - refLat);
        double dLon = Math.toRadians(lon - refLon);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(refLat)) * Math.cos(Math.toRadians(lat)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c * 100.0) / 100.0;
    }

    private RescueMissionResponse mapToResponse(RescueMission mission, String message) {
        return RescueMissionResponse.builder()
                .id(mission.getId())
                .missionCode(mission.getMissionCode())
                .title(mission.getTitle())
                .location(mission.getLocation())
                .victims(mission.getVictims())
                .status(mission.getStatus())
                .priority(mission.getPriority())
                .eta(mission.getEta())
                .distance(mission.getDistance())
                .assignedTeam(mission.getAssignedTeam())
                .responders(mission.getResponders())
                .hospitalId(mission.getHospitalId())
                .message(message)
                .build();
    }
}

