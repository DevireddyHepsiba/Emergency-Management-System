package com.example.hospital.service;

import com.example.hospital.dto.HospitalDepartmentRequest;
import com.example.hospital.dto.HospitalDepartmentResponse;
import com.example.hospital.entity.HospitalDepartment;
import com.example.hospital.exception.UnauthorizedException;
import com.example.hospital.repository.HospitalDepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HospitalDepartmentService {

    private final HospitalDepartmentRepository hospitalDepartmentRepository;

    public HospitalDepartmentResponse createDepartment(HospitalDepartmentRequest request) {
        HospitalDepartment department = HospitalDepartment.builder()
                .hospitalId(request.getHospitalId())
                .departmentName(request.getDepartmentName())
                .beds(request.getBeds())
                .occupiedBeds(0)
                .surgeryCapacity(request.getSurgeryCapacity())
                .occupancyPercentage(0.0)
                .traumas(0L)
                .respiratory(0L)
                .cardiac(0L)
                .burns(0L)
                .other(0L)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        department = hospitalDepartmentRepository.save(department);

        return mapToResponse(department, "Department created successfully");
    }

    public List<HospitalDepartmentResponse> getDepartmentsByHospital(String hospitalId) {
        return hospitalDepartmentRepository.findByHospitalId(hospitalId).stream()
                .map(d -> mapToResponse(d, null))
                .collect(Collectors.toList());
    }

    public HospitalDepartmentResponse getDepartmentById(String departmentId) {
        HospitalDepartment department = hospitalDepartmentRepository.findById(departmentId)
                .orElseThrow(() -> new UnauthorizedException("Department not found"));
        return mapToResponse(department, null);
    }

    public HospitalDepartmentResponse updateOccupancy(String departmentId, Integer occupiedBeds) {
        HospitalDepartment department = hospitalDepartmentRepository.findById(departmentId)
                .orElseThrow(() -> new UnauthorizedException("Department not found"));

        department.setOccupiedBeds(occupiedBeds);
        double occupancy = (double) occupiedBeds / department.getBeds() * 100;
        department.setOccupancyPercentage(Math.round(occupancy * 100.0) / 100.0);
        department.setUpdatedAt(LocalDateTime.now());

        department = hospitalDepartmentRepository.save(department);
        return mapToResponse(department, "Occupancy updated");
    }

    public HospitalDepartmentResponse updatePatientStats(String departmentId, 
                                                          Long traumas, Long respiratory, 
                                                          Long cardiac, Long burns, Long other) {
        HospitalDepartment department = hospitalDepartmentRepository.findById(departmentId)
                .orElseThrow(() -> new UnauthorizedException("Department not found"));

        if (traumas >= 0) department.setTraumas(traumas);
        if (respiratory >= 0) department.setRespiratory(respiratory);
        if (cardiac >= 0) department.setCardiac(cardiac);
        if (burns >= 0) department.setBurns(burns);
        if (other >= 0) department.setOther(other);
        department.setUpdatedAt(LocalDateTime.now());

        department = hospitalDepartmentRepository.save(department);
        return mapToResponse(department, "Patient statistics updated");
    }

    public List<HospitalDepartmentResponse> getAllDepartments() {
        return hospitalDepartmentRepository.findAll().stream()
                .map(d -> mapToResponse(d, null))
                .collect(Collectors.toList());
    }

    private HospitalDepartmentResponse mapToResponse(HospitalDepartment department, String message) {
        return HospitalDepartmentResponse.builder()
                .id(department.getId())
                .hospitalId(department.getHospitalId())
                .departmentName(department.getDepartmentName())
                .beds(department.getBeds())
                .occupiedBeds(department.getOccupiedBeds())
                .occupancyPercentage(department.getOccupancyPercentage())
                .surgeryCapacity(department.getSurgeryCapacity())
                .traumas(department.getTraumas())
                .respiratory(department.getRespiratory())
                .cardiac(department.getCardiac())
                .burns(department.getBurns())
                .other(department.getOther())
                .message(message)
                .build();
    }
}

