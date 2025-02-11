package com.project.Device_Microservice.services;

import com.project.Device_Microservice.dtos.DeviceCreateDTO;
import com.project.Device_Microservice.dtos.DeviceDTO;
import com.project.Device_Microservice.exceptions.DeviceNotFoundException;
import com.project.Device_Microservice.mappers.DeviceMapper;
import com.project.Device_Microservice.models.entities.Device;
import com.project.Device_Microservice.models.entities.User;
import com.project.Device_Microservice.repositories.DeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final DeviceEventProducer deviceEventProducer;

    @Autowired
    public DeviceService(DeviceRepository deviceRepository, DeviceEventProducer deviceEventProducer) {
        this.deviceRepository = deviceRepository;
        this.deviceEventProducer = deviceEventProducer;
    }

    public List<DeviceDTO> findDevices() {
        List<Device> deviceList = deviceRepository.findAll();
        return deviceList.stream()
                .map(DeviceMapper::toDeviceDTO)
                .collect(Collectors.toList());
    }

    public DeviceDTO findDeviceById(Long id) {
        Optional<Device> deviceOptional = deviceRepository.findById(id);
        if (deviceOptional.isEmpty()) {
            throw new DeviceNotFoundException("User with id " + id + " not found");
        }
        return DeviceMapper.toDeviceDTO(deviceOptional.get());
    }

    public List<DeviceDTO> findDevicesByUserId(Long userId) {
        return deviceRepository.findByUserId(userId).stream()
                .map(DeviceMapper::toDeviceDTO)
                .collect(Collectors.toList());
    }

    public int insert(DeviceCreateDTO deviceDTO) {
        Device device = DeviceMapper.toEntity(deviceDTO);
        device.setUser(new User(deviceDTO.getUserId()));
        device = deviceRepository.save(device);

        DeviceDTO deviceEventDTO = DeviceMapper.toDeviceDTO(device);
        deviceEventProducer.sendMessage(deviceEventDTO, "insert");
        return (int) device.getId();
    }
    public double getTotalMaxHourlyEnergyConsumptionById(long deviceId) {
        Device device = deviceRepository.findById(deviceId).orElseThrow(() -> new IllegalArgumentException("Device not found"));
        return device.getMaxHourlyEnergyConsumption();
    }
    public void update(int id, DeviceCreateDTO updatedDeviceDTO) {
        Device existingDevice = deviceRepository.findById((long) id).orElse(null);

        if (existingDevice != null) {
            existingDevice.setDescription(updatedDeviceDTO.getDescription());
            existingDevice.setAddress(updatedDeviceDTO.getAddress());
            existingDevice.setMaxHourlyEnergyConsumption(updatedDeviceDTO.getMaxHourlyEnergyConsumption());
            existingDevice.setUser(new User(updatedDeviceDTO.getUserId()));

            deviceRepository.save(existingDevice);

            DeviceDTO deviceEventDTO = DeviceMapper.toDeviceDTO(existingDevice);
            deviceEventProducer.sendMessage(deviceEventDTO, "update");
        } else {
            throw new DeviceNotFoundException(Device.class.getSimpleName() + " with id: " + id);
        }
    }

    public boolean delete(int id) {
        Device existingDevice = deviceRepository.findById((long) id).orElse(null);

        if (existingDevice != null) {
            DeviceDTO deviceEventDTO = DeviceMapper.toDeviceDTO(existingDevice);
            deviceEventProducer.sendMessage(deviceEventDTO, "delete");

            deviceRepository.delete(existingDevice);
            return true;
        } else {
            return false;
        }
    }

}
