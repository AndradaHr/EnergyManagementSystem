package com.project.Device_Microservice.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeviceCreateDTO {

    @NotNull
    private String description;

    @NotNull
    private String address;

    @NotNull
    private double maxHourlyEnergyConsumption;

    @NotNull
    private Long userId;
}
