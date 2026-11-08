package com.example.dispatch.dto;

import lombok.Data;
import java.util.List;

@Data
public class AmbulanceRequest {
    private String callSign;
    private String type;
    private List<String> capabilities;
    private String hospitalId;
    private Double latitude;
    private Double longitude;
}
