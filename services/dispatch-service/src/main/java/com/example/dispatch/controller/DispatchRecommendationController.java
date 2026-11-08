package com.example.dispatch.controller;

import com.example.dispatch.dto.DispatchRecommendations;
import com.example.dispatch.service.ResourceMatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/emergency")
@RequiredArgsConstructor
@CrossOrigin("*")
public class DispatchRecommendationController {
    private final ResourceMatchingService resourceMatchingService;

    @GetMapping("/{emergencyId}/recommendations")
    public ResponseEntity<DispatchRecommendations> getRecommendations(@PathVariable String emergencyId) {
        return ResponseEntity.ok(resourceMatchingService.recommend(emergencyId));
    }
}
