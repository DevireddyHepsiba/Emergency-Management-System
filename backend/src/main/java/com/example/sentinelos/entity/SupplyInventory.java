package com.example.sentinelos.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "supply_inventory")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupplyInventory {
    @Id
    private String id;
    private String resourceType; // WATER, BLANKETS, MEDICAL_KITS, MEALS, TENTS, HYGIENE_KITS
    private Integer totalQuantity;
    private Integer allocatedQuantity;
    private Integer availableQuantity;
    private Double percentageUsed;
    private String unit; // L, UNITS, PACKS, BOXES
    private Long donationsLast24h;
    private String status; // IN_STOCK, LOW_STOCK, CRITICAL, DEPLETED
    private LocalDateTime lastUpdated;
    private LocalDateTime createdAt;
}

