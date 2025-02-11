package com.project.Monitoring_Microservice.services;

import com.project.Monitoring_Microservice.dtos.EnergyConsumptionDTO;
import com.project.Monitoring_Microservice.entities.Measurement;
import com.project.Monitoring_Microservice.entities.Monitoring;
import com.project.Monitoring_Microservice.entities.Device;
import com.project.Monitoring_Microservice.repositories.DeviceRepository;
import com.project.Monitoring_Microservice.repositories.MeasurementRepository;
import com.project.Monitoring_Microservice.repositories.MonitoringRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class MonitoringService {

    private final MonitoringRepository monitoringRepository;
    private final MeasurementRepository measurementRepository;
    private final DeviceRepository deviceRepository;
    private final NotificationService notificationService;

    @Autowired
    public MonitoringService(MeasurementRepository measurementRepository,MonitoringRepository monitoringRepository, DeviceRepository deviceRepository,NotificationService notificationService) {
       this.measurementRepository=measurementRepository;
       this.monitoringRepository = monitoringRepository;
       this.deviceRepository = deviceRepository;
       this.notificationService = notificationService;
    }

    public double getMaxHourlyEnergyConsumption(long deviceId) {
        return deviceRepository.findByDeviceId(deviceId)
                .map(Device::getMaxHourlyEnergyConsumption)
                .orElseThrow(() -> new IllegalArgumentException("Device with ID " + deviceId + " not found"));
    }

    public List<EnergyConsumptionDTO> getHourlyConsumption(String deviceId, LocalDate date) {
        return monitoringRepository.findHourlyConsumptionByDeviceIdAndDate(deviceId, date);
    }

    public void compareMeasurementValues(long deviceId) {
        double maxConsumptionFromMicroservice2 = getMaxHourlyEnergyConsumption(deviceId);

        Measurement measurement = measurementRepository.findByDeviceId(String.valueOf(deviceId))
                .orElseThrow(() -> new IllegalArgumentException("Measurement not found for deviceId: " + deviceId));

        double measurementValue = measurement.getMeasurementValue();

        if (measurementValue > maxConsumptionFromMicroservice2) {
            deviceRepository.findByDeviceId(deviceId).ifPresent(device -> {
                String message = "Alert: Consumption (" + measurementValue +
                        ") exceeded the maximum limit (" + maxConsumptionFromMicroservice2 + ") for device " +
                        device.getDescription();
                notificationService.notifyUser(device.getUserId(),message);
            });

            System.out.println("Measurement value (" + measurementValue + ") exceeded max hourly energy consumption (" + maxConsumptionFromMicroservice2 + ")");
        } else {
            System.out.println("Consumption is within limits.");
        }
    }

    public void updateMeasurementFromMonitoring(String deviceId) {
        List<Monitoring> monitoringRecords = monitoringRepository.findByDeviceId(deviceId);

        double totalMeasurementValue = monitoringRecords.stream()
                .mapToDouble(Monitoring::getMeasurementValue)
                .sum();

        Measurement existingMeasurement = measurementRepository.findByDeviceId(deviceId).orElse(null);

        if (existingMeasurement != null) {
            existingMeasurement.setMeasurementValue(totalMeasurementValue);
            measurementRepository.save(existingMeasurement);
        } else {
            Measurement newMeasurement = new Measurement();
            newMeasurement.setDeviceId(deviceId);
            newMeasurement.setMeasurementValue(totalMeasurementValue);
            measurementRepository.save(newMeasurement);
        }
    }
}

