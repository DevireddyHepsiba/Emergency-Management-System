package com.example.sentinelos.service;

import com.example.sentinelos.dto.EmergencyRequest;
import com.example.sentinelos.dto.EmergencyResponse;
import com.example.sentinelos.entity.Emergency;
import com.example.sentinelos.exception.UnauthorizedException;
import com.example.sentinelos.repository.EmergencyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmergencyService {

    private final EmergencyRepository emergencyRepository;

    public EmergencyResponse reportEmergency(String userId, String email, EmergencyRequest request) {
        // Validate input
        if (request.getFullName() == null || request.getFullName().isEmpty()) {
            throw new UnauthorizedException("Full name is required");
        }
        if (request.getMobileNumber() == null || request.getMobileNumber().isEmpty()) {
            throw new UnauthorizedException("Mobile number is required");
        }

        // Validate phone number - must have at least 10 digits
        String phoneDigits = request.getMobileNumber().replaceAll("[^0-9]", "");
        if (phoneDigits.length() < 10) {
            throw new UnauthorizedException("Mobile number must contain at least 10 digits");
        }

        if (request.getEmergencyType() == null || request.getEmergencyType().isEmpty()) {
            throw new UnauthorizedException("Emergency type is required");
        }
        if (request.getLatitude() == null || request.getLongitude() == null) {
            throw new UnauthorizedException("Location (latitude and longitude) is required");
        }

        // Determine priority based on emergency type
        String priority = determinePriority(request.getEmergencyType(), request.getHasMedicalEmergency());

        // Create emergency report
        Emergency emergency = Emergency.builder()
                .userId(userId)
                .fullName(request.getFullName())
                .mobileNumber(request.getMobileNumber())
                .emergencyType(request.getEmergencyType())
                .description(request.getDescription() != null ? request.getDescription() : "")
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .victims(request.getVictims() != null ? request.getVictims() : 0)
                .hasMedicalEmergency(request.getHasMedicalEmergency() != null ? request.getHasMedicalEmergency() : false)
                .mediaUrls(request.getMediaUrls())
                .status("REPORTED")
                .priority(priority)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Save to database
        Emergency savedEmergency = emergencyRepository.save(emergency);

        return mapToResponse(savedEmergency, "Emergency report submitted successfully");
    }

    public EmergencyResponse getEmergency(String emergencyId) {
        Emergency emergency = emergencyRepository.findById(emergencyId)
                .orElseThrow(() -> new UnauthorizedException("Emergency report not found"));
        return mapToResponse(emergency, null);
    }

    public List<EmergencyResponse> getUserEmergencies(String userId) {
        List<Emergency> emergencies = emergencyRepository.findByUserId(userId);
        return emergencies.stream()
                .map(e -> mapToResponse(e, null))
                .collect(Collectors.toList());
    }

    public List<EmergencyResponse> getReportedEmergencies() {
        List<Emergency> emergencies = emergencyRepository.findByStatusOrderByCreatedAtDesc("REPORTED");
        return emergencies.stream()
                .map(e -> mapToResponse(e, null))
                .collect(Collectors.toList());
    }

    public List<EmergencyResponse> getEmergenciesByPriority(String priority) {
        List<Emergency> emergencies = emergencyRepository.findByPriority(priority);
        return emergencies.stream()
                .map(e -> mapToResponse(e, null))
                .collect(Collectors.toList());
    }

    public List<EmergencyResponse> getEmergenciesByType(String type) {
        List<Emergency> emergencies = emergencyRepository.findByEmergencyType(type);
        return emergencies.stream()
                .map(e -> mapToResponse(e, null))
                .collect(Collectors.toList());
    }

    public EmergencyResponse acknowledgeEmergency(String emergencyId, String responderUserId) {
        Emergency emergency = emergencyRepository.findById(emergencyId)
                .orElseThrow(() -> new UnauthorizedException("Emergency report not found"));
        
        emergency.setStatus("ACKNOWLEDGED");
        emergency.setAssignedTo(responderUserId);
        emergency.setUpdatedAt(LocalDateTime.now());
        
        Emergency updated = emergencyRepository.save(emergency);
        return mapToResponse(updated, "Emergency acknowledged");
    }

    public EmergencyResponse updateEmergencyStatus(String emergencyId, String newStatus) {
        Emergency emergency = emergencyRepository.findById(emergencyId)
                .orElseThrow(() -> new UnauthorizedException("Emergency report not found"));
        
        emergency.setStatus(newStatus);
        emergency.setUpdatedAt(LocalDateTime.now());
        
        Emergency updated = emergencyRepository.save(emergency);
        return mapToResponse(updated, "Emergency status updated to " + newStatus);
    }

    public void deleteEmergency(String emergencyId) {
        if (!emergencyRepository.existsById(emergencyId)) {
            throw new UnauthorizedException("Emergency report not found");
        }
        emergencyRepository.deleteById(emergencyId);
    }

    private String determinePriority(String emergencyType, Boolean hasMedical) {
        if (hasMedical != null && hasMedical) {
            return "CRITICAL";
        }

        return switch (emergencyType) {
            case "EARTHQUAKE", "FLOOD" -> "CRITICAL";
            case "FIRE", "ACCIDENT" -> "HIGH";
            case "MEDICAL" -> "HIGH";
            default -> "MEDIUM";
        };
    }

    private EmergencyResponse mapToResponse(Emergency emergency, String message) {
        return EmergencyResponse.builder()
                .id(emergency.getId())
                .fullName(emergency.getFullName())
                .mobileNumber(emergency.getMobileNumber())
                .emergencyType(emergency.getEmergencyType())
                .description(emergency.getDescription())
                .latitude(emergency.getLatitude())
                .longitude(emergency.getLongitude())
                .victims(emergency.getVictims())
                .hasMedicalEmergency(emergency.getHasMedicalEmergency())
                .mediaUrls(emergency.getMediaUrls())
                .status(emergency.getStatus())
                .priority(emergency.getPriority())
                .createdAt(emergency.getCreatedAt())
                .updatedAt(emergency.getUpdatedAt())
                .message(message)
                .build();
    }
}

