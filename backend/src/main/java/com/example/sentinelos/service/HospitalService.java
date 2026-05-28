package com.example.sentinelos.service;

import com.example.sentinelos.dto.HospitalRequest;
import com.example.sentinelos.dto.HospitalResponse;
import com.example.sentinelos.entity.Hospital;
import com.example.sentinelos.exception.UnauthorizedException;
import com.example.sentinelos.repository.HospitalRepository;
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
        Hospital hospital = Hospital.builder()
                .name(request.getName())
                .bedsAvailable(request.getBedsAvailable())
                .icuAvailable(request.getIcuAvailable())
                .ambulances(request.getAmbulances())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .address(request.getAddress())
                .phone(request.getPhone())
                .status("ALERT_RECEIVED")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        hospital = hospitalRepository.save(hospital);

        return HospitalResponse.builder()
                .id(hospital.getId())
                .name(hospital.getName())
                .bedsAvailable(hospital.getBedsAvailable())
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
                .icuAvailable(hospital.getIcuAvailable())
                .ambulances(hospital.getAmbulances())
                .latitude(hospital.getLatitude())
                .longitude(hospital.getLongitude())
                .address(hospital.getAddress())
                .phone(hospital.getPhone())
                .status(hospital.getStatus())
                .build();
    }

    public List<HospitalResponse> getAllHospitals() {
        return hospitalRepository.findAll().stream()
                .map(h -> HospitalResponse.builder()
                        .id(h.getId())
                        .name(h.getName())
                        .bedsAvailable(h.getBedsAvailable())
                        .icuAvailable(h.getIcuAvailable())
                        .ambulances(h.getAmbulances())
                        .status(h.getStatus())
                        .build())
                .collect(Collectors.toList());
    }

    public HospitalResponse findNearestHospital(Double latitude, Double longitude) {
        List<Hospital> hospitals = hospitalRepository.findAvailableHospitals();

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
                .icuAvailable(nearest.getIcuAvailable())
                .ambulances(nearest.getAmbulances())
                .distanceKm(Math.round(distance * 100.0) / 100.0)
                .status(nearest.getStatus())
                .build();
    }

    public HospitalResponse updateHospitalStatus(String hospitalId, String newStatus) {
        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new UnauthorizedException("Hospital not found"));

        hospital.setStatus(newStatus);
        hospital.setUpdatedAt(LocalDateTime.now());
        hospital = hospitalRepository.save(hospital);

        return HospitalResponse.builder()
                .id(hospital.getId())
                .name(hospital.getName())
                .status(hospital.getStatus())
                .message("Hospital status updated to " + newStatus)
                .build();
    }

    public HospitalResponse updateHospitalResources(String hospitalId, Integer beds, Integer icu, Integer ambulances) {
        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new UnauthorizedException("Hospital not found"));

        if (beds >= 0) hospital.setBedsAvailable(beds);
        if (icu >= 0) hospital.setIcuAvailable(icu);
        if (ambulances >= 0) hospital.setAmbulances(ambulances);
        hospital.setUpdatedAt(LocalDateTime.now());
        hospital = hospitalRepository.save(hospital);

        return HospitalResponse.builder()
                .id(hospital.getId())
                .name(hospital.getName())
                .bedsAvailable(hospital.getBedsAvailable())
                .icuAvailable(hospital.getIcuAvailable())
                .ambulances(hospital.getAmbulances())
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

