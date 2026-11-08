package com.example.dispatch.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyStatusEvent {
    private String status;
    private String changedBy;
    private String note;
    private LocalDateTime changedAt;
}
