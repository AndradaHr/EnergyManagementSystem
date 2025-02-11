package com.project.Device_Microservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class DeviceDTO {
    private long id;
    private String description;
    private String address;
    private double maxHourlyEnergyConsumption;
    private Long userId;
}
