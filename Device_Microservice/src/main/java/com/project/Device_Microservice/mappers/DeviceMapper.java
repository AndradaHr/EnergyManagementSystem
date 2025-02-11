package com.project.Device_Microservice.mappers;

import com.project.Device_Microservice.dtos.DeviceDTO;
import com.project.Device_Microservice.dtos.DeviceCreateDTO;
import com.project.Device_Microservice.models.entities.Device;

public class DeviceMapper {

    private DeviceMapper() {
    }

    public static DeviceDTO toDeviceDTO(Device device) {
        DeviceDTO dto = new DeviceDTO();
        dto.setId(device.getId());
        dto.setDescription(device.getDescription());
        dto.setAddress(device.getAddress());
        dto.setMaxHourlyEnergyConsumption(device.getMaxHourlyEnergyConsumption());
        if (device.getUser() != null) {
            dto.setUserId(device.getUser().getId());
        } else {
            dto.setUserId(null);
        }
        return dto;
    }

    public static Device toEntity(DeviceCreateDTO deviceCreateDTO) {
        Device device = new Device();
        device.setDescription(deviceCreateDTO.getDescription());
        device.setAddress(deviceCreateDTO.getAddress());
        device.setMaxHourlyEnergyConsumption(deviceCreateDTO.getMaxHourlyEnergyConsumption());
        return device;
    }
}
