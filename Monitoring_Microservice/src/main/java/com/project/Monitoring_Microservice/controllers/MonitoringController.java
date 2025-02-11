package com.project.Monitoring_Microservice.controllers;

import com.project.Monitoring_Microservice.dtos.EnergyConsumptionDTO;
import com.project.Monitoring_Microservice.services.MonitoringService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/monitoring")
public class MonitoringController {

    private final MonitoringService monitoringService;

    @Autowired
    public MonitoringController(MonitoringService monitoringService) {
        this.monitoringService = monitoringService;
    }

    @GetMapping("/consumption")
    public ResponseEntity<List<EnergyConsumptionDTO>> getEnergyConsumption(
            @RequestParam String deviceId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<EnergyConsumptionDTO> energyConsumptionData = monitoringService.getHourlyConsumption(deviceId, date);

        if (energyConsumptionData.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(energyConsumptionData);
    }

    @GetMapping("/{deviceId}/compare-consumption")
    public void compareConsumption(@PathVariable long deviceId) {
        monitoringService.compareMeasurementValues(deviceId);
    }
}
