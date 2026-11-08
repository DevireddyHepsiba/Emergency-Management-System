package com.example.volunteer.repository;

import com.example.volunteer.entity.VolunteerTask;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VolunteerTaskRepository extends MongoRepository<VolunteerTask, String> {
    List<VolunteerTask> findByStatus(String status);
    List<VolunteerTask> findByEmergencyId(String emergencyId);
    List<VolunteerTask> findByPriorityOrderByPriorityDesc(Integer priority);
    List<VolunteerTask> findByLocationIgnoreCase(String location);
    List<VolunteerTask> findByAssignedContainsAndStatus(String volunteerId, String status);
}

