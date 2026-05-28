package com.example.sentinelos.controller;

import com.example.sentinelos.dto.HospitalRequest;
import com.example.sentinelos.dto.HospitalResponse;
import com.example.sentinelos.service.HospitalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospital")
@RequiredArgsConstructor
@CrossOrigin("*")
public class HospitalController {

    private final HospitalService hospitalService;

    @PostMapping("/add")
    public ResponseEntity<HospitalResponse> addHospital(@RequestBody HospitalRequest request) {
        HospitalResponse response = hospitalService.addHospital(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HospitalResponse> getHospital(@PathVariable String id) {
        HospitalResponse response = hospitalService.getHospital(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<List<HospitalResponse>> getAllHospitals() {
        List<HospitalResponse> hospitals = hospitalService.getAllHospitals();
        return ResponseEntity.ok(hospitals);
    }

    @GetMapping("/nearest")
    public ResponseEntity<HospitalResponse> findNearestHospital(
            @RequestParam Double latitude,
            @RequestParam Double longitude) {
        HospitalResponse response = hospitalService.findNearestHospital(latitude, longitude);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<HospitalResponse> updateHospitalStatus(
            @PathVariable String id,
            @RequestParam String status) {
        HospitalResponse response = hospitalService.updateHospitalStatus(id, status);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/resources")
    public ResponseEntity<HospitalResponse> updateHospitalResources(
            @PathVariable String id,
            @RequestParam(required = false, defaultValue = "-1") Integer beds,
            @RequestParam(required = false, defaultValue = "-1") Integer icu,
            @RequestParam(required = false, defaultValue = "-1") Integer ambulances) {
        HospitalResponse response = hospitalService.updateHospitalResources(id, beds, icu, ambulances);
        return ResponseEntity.ok(response);
    }
}

