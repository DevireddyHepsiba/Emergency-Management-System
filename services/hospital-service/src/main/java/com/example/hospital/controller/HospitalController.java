package com.example.hospital.controller;

import com.example.hospital.dto.HospitalRequest;
import com.example.hospital.dto.HospitalResponse;
import com.example.hospital.entity.Role;
import com.example.hospital.entity.User;
import com.example.hospital.exception.UnauthorizedException;
import com.example.hospital.repository.UserRepository;
import com.example.hospital.service.HospitalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospital")
@RequiredArgsConstructor
@CrossOrigin("*")
public class HospitalController {

    private final HospitalService hospitalService;
    private final UserRepository userRepository;

    @PostMapping("/add")
    public ResponseEntity<HospitalResponse> addHospital(@RequestBody HospitalRequest request) {
        return ResponseEntity.ok(hospitalService.addHospital(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HospitalResponse> getHospital(@PathVariable String id, Authentication authentication) {
        assertCanView(id, authentication);
        return ResponseEntity.ok(hospitalService.getHospital(id));
    }

    @GetMapping("/all")
    public ResponseEntity<List<HospitalResponse>> getAllHospitals(Authentication authentication) {
        List<HospitalResponse> hospitals = hospitalService.getAllHospitals();
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user != null && user.getRole() == Role.HOSPITAL) {
            hospitals = hospitals.stream().filter(hospital -> user.getHospitalId() != null && user.getHospitalId().equals(hospital.getId())).toList();
        }
        return ResponseEntity.ok(hospitals);
    }

    @GetMapping("/nearest")
    public ResponseEntity<HospitalResponse> findNearestHospital(
            @RequestParam Double latitude,
            @RequestParam Double longitude) {
        return ResponseEntity.ok(hospitalService.findNearestHospital(latitude, longitude));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<HospitalResponse> updateHospitalStatus(
            @PathVariable String id,
            @RequestParam String status,
            Authentication authentication) {
        assertCanManage(id, authentication);
        return ResponseEntity.ok(hospitalService.updateHospitalStatus(id, status));
    }

    @PutMapping("/{id}/resources")
    public ResponseEntity<HospitalResponse> updateHospitalResources(
            @PathVariable String id,
            @RequestParam(required = false, defaultValue = "-1") Integer beds,
            @RequestParam(required = false, defaultValue = "-1") Integer icu,
            @RequestParam(required = false, defaultValue = "-1") Integer cardiac,
            @RequestParam(required = false, defaultValue = "-1") Integer ambulances,
            Authentication authentication) {
        assertCanManage(id, authentication);
        return ResponseEntity.ok(hospitalService.updateHospitalResources(id, beds, icu, cardiac, ambulances));
    }

    @PutMapping("/{id}/location")
    public ResponseEntity<HospitalResponse> updateHospitalLocation(
            @PathVariable String id,
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            Authentication authentication) {
        assertCanManage(id, authentication);
        return ResponseEntity.ok(hospitalService.updateHospitalLocation(id, latitude, longitude));
    }
    @PutMapping("/{id}/services")
    public ResponseEntity<HospitalResponse> updateHospitalServices(
            @PathVariable String id,
            @RequestBody List<String> services,
            Authentication authentication) {
        assertCanManage(id, authentication);
        return ResponseEntity.ok(hospitalService.updateHospitalServices(id, services));
    }

    private void assertCanView(String hospitalId, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user != null && user.getRole() == Role.HOSPITAL && !hospitalId.equals(user.getHospitalId())) {
            throw new UnauthorizedException("Hospital accounts can view only their assigned facility");
        }
    }
    private void assertCanManage(String hospitalId, Authentication authentication) {
        boolean admin = authentication.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
        if (admin) return;
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UnauthorizedException("Hospital account not found"));
        if (user.getRole() != Role.HOSPITAL || !hospitalId.equals(user.getHospitalId())) {
            throw new UnauthorizedException("Hospital accounts can update only the facility assigned by an admin");
        }
    }
}
