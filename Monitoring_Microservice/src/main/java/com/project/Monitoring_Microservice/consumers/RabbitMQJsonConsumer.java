package com.project.Monitoring_Microservice.consumers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.Monitoring_Microservice.entities.Monitoring;
import com.project.Monitoring_Microservice.repositories.MonitoringRepository;
import com.project.Monitoring_Microservice.services.MonitoringService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;

@Service
public class RabbitMQJsonConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(RabbitMQJsonConsumer.class);
    private final MonitoringRepository monitoringRepository;
    private final ObjectMapper objectMapper;
    private final MonitoringService monitoringService;

    public RabbitMQJsonConsumer(MonitoringRepository monitoringRepository, ObjectMapper objectMapper, MonitoringService monitoringService) {
        this.monitoringRepository = monitoringRepository;
        this.objectMapper = objectMapper;
        this.monitoringService = monitoringService;
    }

    @RabbitListener(queues = {"${rabbitmq.queue.json.name}"})
    public void receive(String message) {
        try {
            LOGGER.info("Receiving message: {}", message);

            Map<String, Object> jsonMessage = objectMapper.readValue(message, Map.class);
            String deviceIdStr = (String) jsonMessage.get("device_id");
            long deviceId = Long.parseLong(deviceIdStr);
            double measurementValue = (double) jsonMessage.get("measurement_value");
            LocalDateTime timestamp = LocalDateTime.parse((String) jsonMessage.get("timestamp"));

            LOGGER.info("Parsed deviceId: {}", deviceId);
            LOGGER.info("Parsed measurementValue: {}", measurementValue);
            LOGGER.info("Parsed timestamp: {}", timestamp);

            Monitoring monitoring = new Monitoring(null, deviceIdStr, measurementValue, timestamp);
            monitoringRepository.save(monitoring);
            monitoringService.updateMeasurementFromMonitoring(deviceIdStr);

            LOGGER.info("Saved monitoring data: {}", monitoring);

            monitoringService.compareMeasurementValues(deviceId);

        } catch (IOException e) {
            LOGGER.error("Error processing message: {}", message, e);
        } catch (IllegalArgumentException e) {
            LOGGER.warn("Error processing device data: {}", e.getMessage());
        } catch (Exception e) {
            LOGGER.error("Unexpected error processing message: {}", message, e);
        }
    }
}
