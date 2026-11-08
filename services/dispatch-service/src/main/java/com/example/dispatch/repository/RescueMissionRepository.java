package com.example.dispatch.repository;

import com.example.dispatch.entity.RescueMission;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RescueMissionRepository extends MongoRepository<RescueMission, String> {
    long countByStatus(String status);
    List<RescueMission> findByStatus(String status);
    List<RescueMission> findByPriority(String priority);
    Optional<RescueMission> findByMissionCode(String missionCode);
    List<RescueMission> findByAssignedTeam(String team);
    List<RescueMission> findByHospitalId(String hospitalId);
    List<RescueMission> findByEmergencyId(String emergencyId);
    
    @Query(value = "{ 'status': { $in: ['OFFERED', 'ACCEPTED', 'EN_ROUTE', 'ASSIGNED', 'REACHED', 'IN_PROGRESS', 'TRANSPORTING', 'ARRIVED'] } }", sort = "{ 'priority': -1 }")
    List<RescueMission> findActiveMissions();
    
    @Query(value = "{ 'missionType': ?0 }", sort = "{ 'createdAt': -1 }")
    List<RescueMission> findByMissionType(String missionType);
}

