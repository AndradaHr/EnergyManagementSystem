package com.project.Monitoring_Microservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class MeasurementDTO {
    private long id;
    private String deviceId;
    private double measurementValue;
}
