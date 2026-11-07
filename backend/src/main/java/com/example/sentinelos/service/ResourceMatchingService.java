package com.example.sentinelos.service;

import com.example.sentinelos.dto.DispatchRecommendations;
import com.example.sentinelos.dto.AmbulanceRecommendation;
import com.example.sentinelos.dto.HospitalResponse;
import com.example.sentinelos.entity.AmbulanceUnit;
import com.example.sentinelos.entity.Emergency;
import com.example.sentinelos.entity.Hospital;
import com.example.sentinelos.exception.UnauthorizedException;
import com.example.sentinelos.repository.AmbulanceUnitRepository;
import com.example.sentinelos.repository.EmergencyRepository;
import com.example.sentinelos.repository.HospitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class ResourceMatchingService {
    private final EmergencyRepository emergencyRepository;
    private final HospitalRepository hospitalRepository;
    private final AmbulanceUnitRepository ambulanceRepository;

    public DispatchRecommendations recommend(String emergencyId) {
        Emergency emergency = emergencyRepository.findById(emergencyId)
                .orElseThrow(() -> new UnauthorizedException("Emergency report not found"));
        if (!"TRIAGED".equals(emergency.getStatus())) {
            throw new UnauthorizedException("A dispatcher must complete triage before resource matching");
        }

        List<String> required = emergency.getRequiredServices() == null ? List.of() : emergency.getRequiredServices();
        List<HospitalResponse> hospitals = "NONE".equalsIgnoreCase(emergency.getRequiredBedType()) ? List.of() : hospitalRepository.findAll().stream()
                .filter(hospital -> "ACTIVE".equals(hospital.getStatus()))
                .filter(hospital -> hospital.getLatitude() != null && hospital.getLongitude() != null)
                .filter(hospital -> hasFreshCapacity(hospital))
                .filter(hospital -> supportsServices(hospital, required))
                .filter(hospital -> hasBed(hospital, emergency.getRequiredBedType()))
                .sorted(Comparator.comparingDouble(hospital -> distanceKm(emergency.getLatitude(), emergency.getLongitude(), hospital.getLatitude(), hospital.getLongitude())))
                .map(hospital -> hospitalResponse(hospital, emergency))
                .toList();

        List<AmbulanceRecommendation> ambulances = Boolean.TRUE.equals(emergency.getNeedsAmbulance())
                ? ambulanceRepository.findByStatus("AVAILABLE").stream()
                    .filter(unit -> unit.getLatitude() != null && unit.getLongitude() != null)
                    .filter(this::hasFreshLocation)
                    .filter(unit -> supportsCapability(unit, emergency.getAmbulanceCapability()))
                    .sorted(Comparator.comparingDouble(unit -> distanceKm(emergency.getLatitude(), emergency.getLongitude(), unit.getLatitude(), unit.getLongitude())))
                    .map(unit -> new AmbulanceRecommendation(unit.getId(), unit.getCallSign(), unit.getType(), unit.getCapabilities(), unit.getStatus(), unit.getHospitalId(), unit.getLatitude(), unit.getLongitude(), distanceKm(emergency.getLatitude(), emergency.getLongitude(), unit.getLatitude(), unit.getLongitude()), unit.getLocationUpdatedAt(), unit.getUpdatedAt()))
                    .toList()
                : List.of();

        String hospitalNotice = "NONE".equalsIgnoreCase(emergency.getRequiredBedType())
                ? "Triage indicates no hospital destination is required."
                : hospitals.isEmpty()
                    ? "No active hospital currently matches the required service, bed type, location, and fresh capacity. Dispatcher review is required."
                    : "Hospitals are filtered by required service, bed type, and capacity updated within the last hour, then sorted by straight-line distance. Confirm capacity and acceptance before dispatch.";
        String ambulanceNotice = Boolean.TRUE.equals(emergency.getNeedsAmbulance()) && ambulances.isEmpty()
                ? " No available ambulance with a fresh location matches the requested capability. Dispatcher review is required."
                : " Ambulances are filtered by capability and a location updated within the last 15 minutes.";
        String notice = hospitalNotice + ambulanceNotice + " Distances are straight-line estimates, not road travel times.";
        return new DispatchRecommendations(emergencyId, hospitals, ambulances, notice);
    }

    private boolean hasFreshCapacity(Hospital hospital) {
        LocalDateTime updated = hospital.getCapacityUpdatedAt() != null ? hospital.getCapacityUpdatedAt() : hospital.getUpdatedAt();
        return updated != null && updated.isAfter(LocalDateTime.now().minusMinutes(60));
    }

    private boolean hasFreshLocation(AmbulanceUnit unit) {
        LocalDateTime locationUpdated = unit.getLocationUpdatedAt() != null ? unit.getLocationUpdatedAt() : unit.getUpdatedAt();
        return locationUpdated != null && locationUpdated.isAfter(LocalDateTime.now().minusMinutes(15));
    }

    private boolean supportsServices(Hospital hospital, List<String> required) {
        if (required.isEmpty()) return true;
        if (hospital.getServices() == null) return false;
        List<String> normalized = hospital.getServices().stream().map(this::normalize).toList();
        return required.stream().map(this::normalize).allMatch(normalized::contains);
    }

    private boolean hasBed(Hospital hospital, String bedType) {
        if (bedType == null || bedType.isBlank()) return hospital.getBedsAvailable() != null && hospital.getBedsAvailable() > 0;
        return switch (bedType.toUpperCase(Locale.ROOT)) {
            case "NONE" -> true;
            case "GENERAL" -> hospital.getBedsAvailable() != null && hospital.getBedsAvailable() > 0;
            case "ICU" -> hospital.getIcuAvailable() != null && hospital.getIcuAvailable() > 0;
            case "CARDIAC" -> hospital.getCardiacBedsAvailable() != null && hospital.getCardiacBedsAvailable() > 0;
            default -> false;
        };
    }

    private boolean supportsCapability(AmbulanceUnit unit, String required) {
        if (required == null || required.isBlank()) return true;
        if (unit.getCapabilities() == null) return false;
        String target = normalize(required);
        return normalize(unit.getType()).equals(target)
                || unit.getCapabilities().stream().map(this::normalize).anyMatch(target::equals);
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toUpperCase(Locale.ROOT).replace(' ', '_');
    }

    private HospitalResponse hospitalResponse(Hospital hospital, Emergency emergency) {
        return HospitalResponse.builder()
                .id(hospital.getId()).name(hospital.getName()).bedsAvailable(hospital.getBedsAvailable())
                .icuAvailable(hospital.getIcuAvailable()).cardiacBedsAvailable(hospital.getCardiacBedsAvailable())
                .ambulances(hospital.getAmbulances()).latitude(hospital.getLatitude()).longitude(hospital.getLongitude())
                .status(hospital.getStatus()).address(hospital.getAddress()).phone(hospital.getPhone())
                .services(hospital.getServices()).capacityUpdatedAt(hospital.getCapacityUpdatedAt())
                .distanceKm(distanceKm(emergency.getLatitude(), emergency.getLongitude(), hospital.getLatitude(), hospital.getLongitude()))
                .build();
    }

    private double distanceKm(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
}
