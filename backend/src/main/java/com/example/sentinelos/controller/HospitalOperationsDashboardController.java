package com.example.sentinelos.controller;

import com.example.sentinelos.repository.HospitalDepartmentRepository;
import com.example.sentinelos.repository.HospitalRepository;
import com.example.sentinelos.service.HospitalDepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard/hospital")
@RequiredArgsConstructor
@CrossOrigin("*")
public class HospitalOperationsDashboardController {

    private final HospitalDepartmentService hospitalDepartmentService;
    private final HospitalDepartmentRepository hospitalDepartmentRepository;
    private final HospitalRepository hospitalRepository;

    @GetMapping("/metrics/{hospitalId}")
    public ResponseEntity<Map<String, Object>> getHospitalMetrics(@PathVariable String hospitalId) {
        Map<String, Object> metrics = new HashMap<>();
        
        var hospital = hospitalRepository.findById(hospitalId);
        if (hospital.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        var hospitalData = hospital.get();
        metrics.put("hospitalName", hospitalData.getName());
        metrics.put("availableBeds", hospitalData.getBedsAvailable());
        metrics.put("totalBeds", 1500); // Example total
        
        // Get all departments
        var departments = hospitalDepartmentRepository.findByHospitalId(hospitalId);
        
        // Calculate ICU metrics
        var icuDept = departments.stream()
                .filter(d -> "ICU".equals(d.getDepartmentName()))
                .findFirst();
        
        if (icuDept.isPresent()) {
            metrics.put("icuFree", icuDept.get().getBeds() - icuDept.get().getOccupiedBeds());
            metrics.put("icuTotal", icuDept.get().getBeds());
            metrics.put("icuOccupancy", icuDept.get().getOccupancyPercentage());
        }
        
        // Incoming patients (12 next 15a)
        metrics.put("incomingPatients", 12);
        metrics.put("incomingTimeframe", "15a");
        
        // Surgery capacity
        int avgSurgeryCapacity = (int) departments.stream()
                .mapToInt(d -> d.getSurgeryCapacity() != null ? d.getSurgeryCapacity() : 0)
                .average()
                .orElse(0.0);
        metrics.put("surgeryCapacity", avgSurgeryCapacity + "%");
        
        // Department occupancy breakdown
        Map<String, Double> departmentOccupancy = new HashMap<>();
        departments.forEach(d -> 
            departmentOccupancy.put(d.getDepartmentName(), d.getOccupancyPercentage())
        );
        metrics.put("departmentOccupancy", departmentOccupancy);
        
        // Department details
        metrics.put("departments", departments);
        
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/departments/{hospitalId}")
    public ResponseEntity<?> getDepartmentDetails(@PathVariable String hospitalId) {
        var departments = hospitalDepartmentRepository.findByHospitalId(hospitalId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("hospitalId", hospitalId);
        response.put("totalDepartments", departments.size());
        
        // Occupancy overview
        Map<String, Object> occupancyOverview = new HashMap<>();
        departments.forEach(d -> {
            Map<String, Object> deptInfo = new HashMap<>();
            deptInfo.put("occupancy", d.getOccupancyPercentage());
            deptInfo.put("beds", d.getBeds());
            deptInfo.put("occupied", d.getOccupiedBeds());
            occupancyOverview.put(d.getDepartmentName(), deptInfo);
        });
        response.put("occupancyOverview", occupancyOverview);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/incoming-patients/{hospitalId}")
    public ResponseEntity<Map<String, Object>> getIncomingPatients(@PathVariable String hospitalId) {
        Map<String, Object> response = new HashMap<>();
        
        // Example incoming patients - would be from a PatientQueue entity in production
        response.put("incoming", new Object[] {
            new PatientInfo("P-4812", "Trauma — Crush Injury", "2 MIN"),
            new PatientInfo("P-4811", "Respiratory", "4 MIN"),
            new PatientInfo("P-4810", "Pediatric Burn", "6 MIN"),
            new PatientInfo("P-4809", "Cardiac Arrest", "8 MIN"),
            new PatientInfo("P-4808", "Fracture", "12 MIN")
        });
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/patient-queue/{hospitalId}")
    public ResponseEntity<Map<String, Object>> getPatientQueue(@PathVariable String hospitalId) {
        Map<String, Object> response = new HashMap<>();
        
        // Patient queue statistics (last 24h)
        Map<String, Integer> queueStats = new HashMap<>();
        queueStats.put("TRAUMA", 84);
        queueStats.put("RESP", 52);
        queueStats.put("CARDIAC", 38);
        queueStats.put("BURN", 22);
        queueStats.put("OTHER", 64);
        
        response.put("queueStats", queueStats);
        response.put("totalInQueue", 260);
        response.put("timeframe", "Last 24h");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/occupancy-alert/{hospitalId}")
    public ResponseEntity<Map<String, Object>> getOccupancyAlerts(@PathVariable String hospitalId) {
        Map<String, Object> response = new HashMap<>();
        
        var departments = hospitalDepartmentRepository.findByHospitalId(hospitalId);
        
        var criticalDepts = departments.stream()
                .filter(d -> d.getOccupancyPercentage() >= 85)
                .toList();
        
        response.put("criticalAlerts", criticalDepts.size());
        response.put("departments", criticalDepts);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/analytics/{hospitalId}")
    public ResponseEntity<Map<String, Object>> getHospitalAnalytics(@PathVariable String hospitalId) {
        Map<String, Object> analytics = new HashMap<>();
        
        var departments = hospitalDepartmentRepository.findByHospitalId(hospitalId);
        
        // Patient type distribution
        Map<String, Long> patientDistribution = new HashMap<>();
        patientDistribution.put("TRAUMA", departments.stream()
                .mapToLong(d -> d.getTraumas() != null ? d.getTraumas() : 0).sum());
        patientDistribution.put("RESPIRATORY", departments.stream()
                .mapToLong(d -> d.getRespiratory() != null ? d.getRespiratory() : 0).sum());
        patientDistribution.put("CARDIAC", departments.stream()
                .mapToLong(d -> d.getCardiac() != null ? d.getCardiac() : 0).sum());
        patientDistribution.put("BURNS", departments.stream()
                .mapToLong(d -> d.getBurns() != null ? d.getBurns() : 0).sum());
        
        analytics.put("patientDistribution", patientDistribution);
        
        // Average occupancy
        double avgOccupancy = departments.stream()
                .mapToDouble(d -> d.getOccupancyPercentage() != null ? d.getOccupancyPercentage() : 0)
                .average()
                .orElse(0.0);
        analytics.put("averageOccupancy", Math.round(avgOccupancy * 100.0) / 100.0);
        
        return ResponseEntity.ok(analytics);
    }

    // Helper class for incoming patients
    static class PatientInfo {
        public String id;
        public String condition;
        public String eta;
        
        PatientInfo(String id, String condition, String eta) {
            this.id = id;
            this.condition = condition;
            this.eta = eta;
        }
    }
}

