package com.project.Monitoring_Microservice.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="device")
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private long id;

    @Column(name = "device_id", nullable = false)
    private long deviceId;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "max_hourly_energy_consumption", nullable = false)
    private double maxHourlyEnergyConsumption;

    @Column(name = "user_id", nullable = false)
    private long userId;

    @Override
    public String toString() {
        return "Device{" +
                "id=" + id +
                ", deviceId=" + deviceId +
                ", description='" + description + '\'' +
                ", maxHourlyEnergyConsumption=" + maxHourlyEnergyConsumption +
                ", userId=" + userId +
                '}';
    }

}
