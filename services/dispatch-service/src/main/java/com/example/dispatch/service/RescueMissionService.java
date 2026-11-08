package com.example.dispatch.service;

import com.example.dispatch.dto.RescueMissionRequest;
import com.example.dispatch.dto.RescueMissionResponse;
import com.example.dispatch.entity.RescueMission;
import com.example.dispatch.entity.Emergency;
import com.example.dispatch.entity.EmergencyStatusEvent;
import com.example.dispatch.entity.AmbulanceUnit;
import com.example.dispatch.dto.DispatchRecommendations;
import com.example.dispatch.exception.UnauthorizedException;
import com.example.dispatch.repository.RescueMissionRepository;
import com.example.dispatch.repository.EmergencyRepository;
import com.example.dispatch.repository.AmbulanceUnitRepository;
import com.example.dispatch.service.ResourceMatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RescueMissionService {

    private final RescueMissionRepository rescueMissionRepository;
    private final EmergencyRepository emergencyRepository;
    private final AmbulanceUnitRepository ambulanceRepository;
    private final ResourceMatchingService resourceMatchingService;
    public RescueMissionResponse createMission(RescueMissionRequest request) {
        if (request.getEmergencyId() == null || request.getEmergencyId().isBlank()) throw new UnauthorizedException("Select a triaged emergency");
        Emergency emergency = emergencyRepository.findById(request.getEmergencyId())
                .orElseThrow(() -> new UnauthorizedException("Emergency report not found"));
        if (!"TRIAGED".equals(emergency.getStatus())) throw new UnauthorizedException("Only triaged incidents can be dispatched");

        DispatchRecommendations recommendations = resourceMatchingService.recommend(emergency.getId());
        boolean hospitalRequired = !"NONE".equalsIgnoreCase(emergency.getRequiredBedType());
        if (hospitalRequired && (request.getHospitalId() == null || recommendations.getHospitals().stream().noneMatch(h -> h.getId().equals(request.getHospitalId())))) {
            throw new UnauthorizedException("Choose a hospital from the current suitable recommendations");
        }
        boolean ambulanceRequired = Boolean.TRUE.equals(emergency.getNeedsAmbulance());
        if (ambulanceRequired && (request.getAmbulanceId() == null || recommendations.getAmbulances().stream().noneMatch(a -> a.getId().equals(request.getAmbulanceId())))) {
            throw new UnauthorizedException("Choose an available ambulance matching the triage requirement");
        }

        AmbulanceUnit ambulance = request.getAmbulanceId() == null ? null : ambulanceRepository.findById(request.getAmbulanceId())
                .orElseThrow(() -> new UnauthorizedException("Ambulance not found"));
        String missionCode = "M-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        RescueMission mission = RescueMission.builder()
                .missionCode(missionCode)
                .emergencyId(emergency.getId())
                .title(emergency.getEmergencyType() + " response")
                .description(emergency.getDescription())
                .location(emergency.getLatitude() + ", " + emergency.getLongitude())
                .latitude(emergency.getLatitude())
                .longitude(emergency.getLongitude())
                .victims(emergency.getVictims())
                .missionType(emergency.getEmergencyType())
                .priority(emergency.getPriority())
                .status("OFFERED")
                .eta(null)
                .distance(null)
                .ambulanceId(request.getAmbulanceId())
                .assignedVehicle(ambulance == null ? null : ambulance.getCallSign())
                .assignedTeam(ambulance == null ? null : ambulance.getType())
                .hospitalId(request.getHospitalId())
                .requiredBedType(emergency.getRequiredBedType())
                .teamAccepted(!ambulanceRequired)
                .hospitalAccepted(!hospitalRequired)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        mission = rescueMissionRepository.save(mission);
        if (ambulance != null) {
            ambulance.setStatus("OFFERED");
            ambulance.setUpdatedAt(LocalDateTime.now());
            ambulanceRepository.save(ambulance);
        }
        if (Boolean.TRUE.equals(mission.getTeamAccepted()) && Boolean.TRUE.equals(mission.getHospitalAccepted())) {
            mission.setStatus("ACCEPTED");
            mission = rescueMissionRepository.save(mission);
            updateIncidentStatus(emergency.getId(), "DISPATCHED", "No external resource acceptance was required", "dispatch-workflow");
        }

        return mapToResponse(mission, "Response offer created. It is not dispatched until the required parties accept.");
    }

    public RescueMissionResponse recordAcceptance(String missionId, String side, boolean accepted, String actorEmail) {
        RescueMission mission = rescueMissionRepository.findById(missionId)
                .orElseThrow(() -> new UnauthorizedException("Mission not found"));
        if (!"OFFERED".equals(mission.getStatus())) throw new UnauthorizedException("Only offered missions can receive an acceptance decision");
        if ("TEAM".equalsIgnoreCase(side)) {
            if (mission.getAmbulanceId() == null) throw new UnauthorizedException("This mission has no ambulance assignment");
            mission.setTeamAccepted(accepted);
            if (accepted) { mission.setTeamAcceptedAt(LocalDateTime.now()); mission.setTeamAcceptedBy(actorEmail); }
        } else if ("HOSPITAL".equalsIgnoreCase(side)) {
            if (mission.getHospitalId() == null) throw new UnauthorizedException("This mission has no hospital referral");
            mission.setHospitalAccepted(accepted);
            if (accepted) { mission.setHospitalAcceptedAt(LocalDateTime.now()); mission.setHospitalAcceptedBy(actorEmail); }
        } else {
            throw new UnauthorizedException("Unknown acceptance type");
        }

        if (!accepted) {
            mission.setStatus("DECLINED");
            if (mission.getAmbulanceId() != null) ambulanceRepository.findById(mission.getAmbulanceId()).ifPresent(unit -> {
                unit.setStatus("AVAILABLE"); unit.setUpdatedAt(LocalDateTime.now()); ambulanceRepository.save(unit);
            });
        } else if (Boolean.TRUE.equals(mission.getTeamAccepted()) && Boolean.TRUE.equals(mission.getHospitalAccepted())) {
            mission.setStatus("ACCEPTED");
            if (mission.getAmbulanceId() != null) ambulanceRepository.findById(mission.getAmbulanceId()).ifPresent(unit -> {
                unit.setStatus("ASSIGNED"); unit.setUpdatedAt(LocalDateTime.now()); ambulanceRepository.save(unit);
            });
            updateIncidentStatus(mission.getEmergencyId(), "DISPATCHED", "Required team and hospital acceptances recorded", actorEmail);
        }
        mission.setUpdatedAt(LocalDateTime.now());
        return mapToResponse(rescueMissionRepository.save(mission), accepted ? "Acceptance recorded" : "Offer declined; dispatcher must select another resource");
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

        boolean validTransition = switch (mission.getStatus()) {
            case "ACCEPTED" -> "EN_ROUTE".equals(newStatus);
            case "EN_ROUTE" -> "REACHED".equals(newStatus);
            case "REACHED" -> "TRANSPORTING".equals(newStatus);
            case "TRANSPORTING" -> "ARRIVED".equals(newStatus);
            case "ARRIVED" -> "COMPLETED".equals(newStatus);
            default -> false;
        };
        if (!validTransition) {
            throw new UnauthorizedException("Invalid mission status transition: " + mission.getStatus() + " to " + newStatus);
        }

        mission.setStatus(newStatus);
        mission.setUpdatedAt(LocalDateTime.now());
        
        if ("REACHED".equals(newStatus)) {
            mission.setReachedAt(LocalDateTime.now());
        } else if ("COMPLETED".equals(newStatus)) {
            mission.setCompletedAt(LocalDateTime.now());
        }

        mission = rescueMissionRepository.save(mission);
        if ("REACHED".equals(newStatus)) updateIncidentStatus(mission.getEmergencyId(), "ON_SCENE", "Response team reached the incident", "response-team");
        if ("TRANSPORTING".equals(newStatus)) updateIncidentStatus(mission.getEmergencyId(), "TRANSPORTING", "Patient transport started", "response-team");
        if ("ARRIVED".equals(newStatus)) updateIncidentStatus(mission.getEmergencyId(), "ARRIVED", "Patient arrived at the receiving hospital", "response-team");
        if ("COMPLETED".equals(newStatus)) {
            String completedMissionId = mission.getId();
            String completedEmergencyId = mission.getEmergencyId();
            if (mission.getAmbulanceId() != null) ambulanceRepository.findById(mission.getAmbulanceId()).ifPresent(unit -> {
                unit.setStatus("AVAILABLE"); unit.setUpdatedAt(LocalDateTime.now()); ambulanceRepository.save(unit);
            });
            boolean otherOpenMissions = rescueMissionRepository.findByEmergencyId(completedEmergencyId).stream()
                    .anyMatch(other -> !other.getId().equals(completedMissionId) && !"COMPLETED".equals(other.getStatus()) && !"DECLINED".equals(other.getStatus()));
            if (!otherOpenMissions) updateIncidentStatus(completedEmergencyId, "RESOLVED", "Response mission completed", "response-team");
        }
        return mapToResponse(mission, "Mission status updated to " + newStatus);
    }

    private void updateIncidentStatus(String emergencyId, String status, String note, String actor) {
        if (emergencyId == null) return;
        emergencyRepository.findById(emergencyId).ifPresent(emergency -> {
            emergency.setStatus(status);
            emergency.setUpdatedAt(LocalDateTime.now());
            if (emergency.getStatusHistory() == null) emergency.setStatusHistory(new java.util.ArrayList<>());
            emergency.getStatusHistory().add(EmergencyStatusEvent.builder().status(status).changedBy(actor)
                    .note(note).changedAt(LocalDateTime.now()).build());
            emergencyRepository.save(emergency);
        });
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

    private RescueMissionResponse mapToResponse(RescueMission mission, String message) {
        return RescueMissionResponse.builder()
                .id(mission.getId())
                .missionCode(mission.getMissionCode())
                .emergencyId(mission.getEmergencyId())
                .title(mission.getTitle())
                .description(mission.getDescription())
                .location(mission.getLocation())
                .latitude(mission.getLatitude())
                .longitude(mission.getLongitude())
                .victims(mission.getVictims())
                .missionType(mission.getMissionType())
                .status(mission.getStatus())
                .priority(mission.getPriority())
                .eta(mission.getEta())
                .distance(mission.getDistance())
                .assignedTeam(mission.getAssignedTeam())
                .assignedVehicle(mission.getAssignedVehicle())
                .responders(mission.getResponders())
                .hospitalId(mission.getHospitalId())
                .ambulanceId(mission.getAmbulanceId())
                .teamAccepted(mission.getTeamAccepted())
                .hospitalAccepted(mission.getHospitalAccepted())
                .requiredBedType(mission.getRequiredBedType())
                .teamAcceptedBy(mission.getTeamAcceptedBy())
                .hospitalAcceptedBy(mission.getHospitalAcceptedBy())
                .message(message)
                .build();
    }
}

