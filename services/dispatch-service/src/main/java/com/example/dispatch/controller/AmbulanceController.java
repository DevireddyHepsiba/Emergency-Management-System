package com.example.dispatch.controller;

import com.example.dispatch.dto.AmbulanceRequest;
import com.example.dispatch.entity.AmbulanceUnit;
import com.example.dispatch.entity.Role;
import com.example.dispatch.entity.User;
import com.example.dispatch.exception.UnauthorizedException;
import com.example.dispatch.repository.AmbulanceUnitRepository;
import com.example.dispatch.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/hospital/ambulances")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AmbulanceController {
    private final AmbulanceUnitRepository ambulanceRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<AmbulanceUnit>> getAll(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user != null && user.getRole() == Role.HOSPITAL) {
            return ResponseEntity.ok(user.getHospitalId() == null ? List.of() : ambulanceRepository.findByHospitalId(user.getHospitalId()));
        }
        return ResponseEntity.ok(ambulanceRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<AmbulanceUnit> add(@RequestBody AmbulanceRequest request, Authentication authentication) {
        if (request.getCallSign() == null || request.getCallSign().isBlank()
                || request.getType() == null || request.getType().isBlank()) {
            throw new UnauthorizedException("Ambulance call sign and type are required");
        }
        if (request.getLatitude() == null || request.getLongitude() == null
                || request.getLatitude() < -90 || request.getLatitude() > 90
                || request.getLongitude() < -180 || request.getLongitude() > 180) {
            throw new UnauthorizedException("A valid ambulance location is required");
        }
        User actor = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UnauthorizedException("Account not found"));
        if (actor.getRole() == Role.HOSPITAL && (actor.getHospitalId() == null || !actor.getHospitalId().equals(request.getHospitalId()))) {
            throw new UnauthorizedException("Hospital accounts can register units only for their assigned hospital");
        }
        AmbulanceUnit unit = AmbulanceUnit.builder()
                .callSign(request.getCallSign().trim())
                .type(request.getType().trim().toUpperCase())
                .capabilities(request.getCapabilities() == null ? List.of() : request.getCapabilities())
                .hospitalId(request.getHospitalId())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .status("AVAILABLE")
                .locationUpdatedAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(ambulanceRepository.save(unit));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<AmbulanceUnit> updateStatus(@PathVariable String id, @RequestParam String status, Authentication authentication) {
        if (!List.of("AVAILABLE", "OUT_OF_SERVICE").contains(status.toUpperCase())) {
            throw new UnauthorizedException("Set ambulance status to AVAILABLE or OUT_OF_SERVICE");
        }
        AmbulanceUnit unit = ambulanceRepository.findById(id)
                .orElseThrow(() -> new UnauthorizedException("Ambulance not found"));
        assertCanManage(unit, authentication);
        unit.setStatus(status.toUpperCase());
        unit.setUpdatedAt(LocalDateTime.now());
        return ResponseEntity.ok(ambulanceRepository.save(unit));
    }

    @PutMapping("/{id}/location")
    public ResponseEntity<AmbulanceUnit> updateLocation(@PathVariable String id, @RequestParam Double latitude, @RequestParam Double longitude, Authentication authentication) {
        if (latitude == null || longitude == null || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            throw new UnauthorizedException("A valid ambulance location is required");
        }
        AmbulanceUnit unit = ambulanceRepository.findById(id)
                .orElseThrow(() -> new UnauthorizedException("Ambulance not found"));
        assertCanManage(unit, authentication);
        unit.setLatitude(latitude);
        unit.setLongitude(longitude);
        unit.setLocationUpdatedAt(LocalDateTime.now());
        unit.setUpdatedAt(LocalDateTime.now());
        return ResponseEntity.ok(ambulanceRepository.save(unit));
    }

    private void assertCanManage(AmbulanceUnit unit, Authentication authentication) {
        User actor = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UnauthorizedException("Account not found"));
        if (actor.getRole() == Role.ADMIN) return;
        if (actor.getRole() != Role.HOSPITAL || actor.getHospitalId() == null
                || !actor.getHospitalId().equals(unit.getHospitalId())) {
            throw new UnauthorizedException("You can manage only ambulances assigned to your hospital");
        }
    }
}
