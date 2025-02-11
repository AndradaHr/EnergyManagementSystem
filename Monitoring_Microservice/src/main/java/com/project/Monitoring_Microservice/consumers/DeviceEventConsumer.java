package com.project.Monitoring_Microservice.consumers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.Monitoring_Microservice.dtos.DeviceDTO;
import com.project.Monitoring_Microservice.entities.Device;
import com.project.Monitoring_Microservice.repositories.DeviceRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class DeviceEventConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(DeviceEventConsumer.class);
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final DeviceRepository deviceRepository;

    @Autowired
    public DeviceEventConsumer(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    @RabbitListener(queues = "${rabbitmq.queue.name}")
    public void receiveMessage(Map<String, Object> message) {
        try {
            DeviceDTO deviceDTO = objectMapper.convertValue(message.get("device"), DeviceDTO.class);
            String actionType = (String) message.get("actionType");

            switch (actionType) {
                case "insert":
                    Device newDevice = new Device();
                    newDevice.setDeviceId(deviceDTO.getId());
                    newDevice.setDescription(deviceDTO.getDescription());
                    newDevice.setMaxHourlyEnergyConsumption(deviceDTO.getMaxHourlyEnergyConsumption());
                    newDevice.setUserId(deviceDTO.getUserId());
                    deviceRepository.save(newDevice);
                    LOGGER.info("Device inserted: {}", newDevice);
                    break;

                case "update":
                    Optional<Device> existingDevice = deviceRepository.findByDeviceId(deviceDTO.getId());
                    if (existingDevice.isPresent()) {
                        Device deviceToUpdate = existingDevice.get();
                        deviceToUpdate.setDescription(deviceDTO.getDescription());
                        deviceToUpdate.setMaxHourlyEnergyConsumption(deviceDTO.getMaxHourlyEnergyConsumption());
                        deviceToUpdate.setUserId(deviceDTO.getUserId());
                        deviceRepository.save(deviceToUpdate);
                        LOGGER.info("Device updated: {}", deviceToUpdate);
                    } else {
                        LOGGER.warn("Device with ID {} not found for update", deviceDTO.getId());
                    }
                    break;

                case "delete":
                    deviceRepository.deleteByDeviceId(deviceDTO.getId());
                    LOGGER.info("Device deleted: {}", deviceDTO.getId());
                    break;

                default:
                    LOGGER.warn("Unknown actionType for device: {}", deviceDTO);
            }
        } catch (Exception e) {
            LOGGER.error("Error processing device event", e);
        }
    }
}
