package com.project.Monitoring_Microservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EnergyConsumptionDTO {
    private int hour;
    private double totalConsumption;

}
