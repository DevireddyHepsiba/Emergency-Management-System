package com.example.hospital.service;

import com.example.hospital.dto.HospitalRequest;
import com.example.hospital.dto.HospitalResponse;
import com.example.hospital.entity.Hospital;
import com.example.hospital.exception.UnauthorizedException;
import com.example.hospital.repository.HospitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HospitalService {

    private final HospitalRepository hospitalRepository;

    public HospitalResponse addHospital(HospitalRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new UnauthorizedException("Hospital name is required");
        }
        if (request.getLatitude() == null || request.getLongitude() == null
                || request.getLatitude() < -90 || request.getLatitude() > 90
                || request.getLongitude() < -180 || request.getLongitude() > 180) {
            throw new UnauthorizedException("Valid hospital coordinates are required");
        }
        Integer[] counts = {request.getBedsAvailable(), request.getIcuAvailable(), request.getAmbulances()};
        for (Integer count : counts) {
            if (count == null || count < 0) {
                throw new UnauthorizedException("Hospital resource counts must be zero or greater");
            }
        }
        if (request.getCardiacBedsAvailable() != null && request.getCardiacBedsAvailable() < 0) {
            throw new UnauthorizedException("Cardiac bed count must be zero or greater");
        }
        Hospital hospital = Hospital.builder()
                .name(request.getName())
                .bedsAvailable(request.getBedsAvailable())
                .cardiacBedsAvailable(request.getCardiacBedsAvailable() == null ? 0 : request.getCardiacBedsAvailable())
                .icuAvailable(request.getIcuAvailable())
                .ambulances(request.getAmbulances())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .address(request.getAddress())
                .phone(request.getPhone())
                .services(request.getServices() == null ? List.of() : request.getServices())
                .capacityUpdatedAt(LocalDateTime.now())
                // A newly registered facility starts available for dispatch matching.
                // Hospital incident workflow statuses are updated separately when a referral arrives.
                .status("ACTIVE")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        hospital = hospitalRepository.save(hospital);

        return HospitalResponse.builder()
                .id(hospital.getId())
                .name(hospital.getName())
                .bedsAvailable(hospital.getBedsAvailable())
                .cardiacBedsAvailable(hospital.getCardiacBedsAvailable())
                .icuAvailable(hospital.getIcuAvailable())
                .ambulances(hospital.getAmbulances())
                .status(hospital.getStatus())
                .message("Hospital added successfully")
                .build();
    }

    public HospitalResponse getHospital(String hospitalId) {
        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new UnauthorizedException("Hospital not found"));

        return HospitalResponse.builder()
                .id(hospital.getId())
                .name(hospital.getName())
                .bedsAvailable(hospital.getBedsAvailable())
                .cardiacBedsAvailable(hospital.getCardiacBedsAvailable())
                .icuAvailable(hospital.getIcuAvailable())
                .ambulances(hospital.getAmbulances())
                .latitude(hospital.getLatitude())
                .longitude(hospital.getLongitude())
                .address(hospital.getAddress())
                .phone(hospital.getPhone())
                .services(hospital.getServices())
                .capacityUpdatedAt(hospital.getCapacityUpdatedAt())
                .status(hospital.getStatus())
                .build();
    }

    public List<HospitalResponse> getAllHospitals() {
        return hospitalRepository.findAll().stream()
                .map(h -> HospitalResponse.builder()
                        .id(h.getId())
                        .name(h.getName())
                        .bedsAvailable(h.getBedsAvailable())
                        .cardiacBedsAvailable(h.getCardiacBedsAvailable())
                        .icuAvailable(h.getIcuAvailable())
                        .ambulances(h.getAmbulances())
                        .latitude(h.getLatitude())
                        .longitude(h.getLongitude())
                        .address(h.getAddress())
                        .phone(h.getPhone())
                        .services(h.getServices())
                        .capacityUpdatedAt(h.getCapacityUpdatedAt())
                        .status(h.getStatus())
                        .build())
                .collect(Collectors.toList());
    }

    public HospitalResponse findNearestHospital(Double latitude, Double longitude) {
        List<Hospital> hospitals = hospitalRepository.findAvailableHospitals().stream()
                .filter(hospital -> hospital.getLatitude() != null && hospital.getLongitude() != null)
                .toList();

        if (hospitals.isEmpty()) {
            throw new UnauthorizedException("No hospitals available");
        }

        Hospital nearest = hospitals.stream()
                .min(Comparator.comparingDouble(h -> calculateDistance(
                        latitude, longitude, h.getLatitude(), h.getLongitude()
                )))
                .orElse(hospitals.get(0));

        double distance = calculateDistance(latitude, longitude, nearest.getLatitude(), nearest.getLongitude());

        return HospitalResponse.builder()
                .id(nearest.getId())
                .name(nearest.getName())
                .bedsAvailable(nearest.getBedsAvailable())
                .cardiacBedsAvailable(nearest.getCardiacBedsAvailable())
                .icuAvailable(nearest.getIcuAvailable())
                .ambulances(nearest.getAmbulances())
                .distanceKm(Math.round(distance * 100.0) / 100.0)
                .status(nearest.getStatus())
                .services(nearest.getServices())
                .capacityUpdatedAt(nearest.getCapacityUpdatedAt())
                .build();
    }

    public HospitalResponse updateHospitalStatus(String hospitalId, String newStatus) {
        if (!List.of("ACTIVE", "ALERT_RECEIVED", "PREPARING", "PATIENT_RECEIVED", "TREATMENT_STARTED")
                .contains(newStatus.toUpperCase())) {
            throw new UnauthorizedException("Invalid hospital status");
        }
        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new UnauthorizedException("Hospital not found"));

        hospital.setStatus(newStatus.toUpperCase());
        hospital.setUpdatedAt(LocalDateTime.now());
        hospital = hospitalRepository.save(hospital);

        return HospitalResponse.builder()
                .id(hospital.getId())
                .name(hospital.getName())
                .status(hospital.getStatus())
                .message("Hospital status updated to " + newStatus)
                .build();
    }

    public HospitalResponse updateHospitalLocation(String hospitalId, Double latitude, Double longitude) {
        if (latitude == null || longitude == null || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            throw new UnauthorizedException("Enter a valid latitude and longitude");
        }
        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new UnauthorizedException("Hospital not found"));
        hospital.setLatitude(latitude);
        hospital.setLongitude(longitude);
        hospital.setUpdatedAt(LocalDateTime.now());
        hospital = hospitalRepository.save(hospital);
        return HospitalResponse.builder().id(hospital.getId()).name(hospital.getName())
                .latitude(hospital.getLatitude()).longitude(hospital.getLongitude())
                .message("Hospital location updated").build();
    }
    public HospitalResponse updateHospitalServices(String hospitalId, List<String> services) {
        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new UnauthorizedException("Hospital not found"));
        hospital.setServices(services == null ? List.of() : services.stream()
                .filter(service -> service != null && !service.isBlank())
                .map(service -> service.trim().toUpperCase())
                .distinct().toList());
        hospital.setUpdatedAt(LocalDateTime.now());
        hospital.setCapacityUpdatedAt(LocalDateTime.now());
        hospital = hospitalRepository.save(hospital);
        return HospitalResponse.builder().id(hospital.getId()).name(hospital.getName())
                .services(hospital.getServices()).capacityUpdatedAt(hospital.getCapacityUpdatedAt())
                .message("Hospital services updated").build();
    }

    public HospitalResponse updateHospitalResources(String hospitalId, Integer beds, Integer icu, Integer cardiac, Integer ambulances) {
        if ((beds != null && beds < -1) || (icu != null && icu < -1) || (cardiac != null && cardiac < -1) || (ambulances != null && ambulances < -1)) {
            throw new UnauthorizedException("Hospital resource counts cannot be negative");
        }
        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new UnauthorizedException("Hospital not found"));

        if (beds >= 0) hospital.setBedsAvailable(beds);
        if (icu >= 0) hospital.setIcuAvailable(icu);
        if (cardiac != null && cardiac >= 0) hospital.setCardiacBedsAvailable(cardiac);
        if (ambulances >= 0) hospital.setAmbulances(ambulances);
        hospital.setUpdatedAt(LocalDateTime.now());
        hospital.setCapacityUpdatedAt(LocalDateTime.now());
        hospital = hospitalRepository.save(hospital);

        return HospitalResponse.builder()
                .id(hospital.getId())
                .name(hospital.getName())
                .bedsAvailable(hospital.getBedsAvailable())
                .cardiacBedsAvailable(hospital.getCardiacBedsAvailable())
                .icuAvailable(hospital.getIcuAvailable())
                .ambulances(hospital.getAmbulances())
                .capacityUpdatedAt(hospital.getCapacityUpdatedAt())
                .message("Hospital resources updated")
                .build();
    }

    // Calculate distance between two coordinates (Haversine formula)
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}

