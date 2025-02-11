package com.project.Device_Microservice.controllers;

import com.project.Device_Microservice.dtos.DeviceCreateDTO;
import com.project.Device_Microservice.dtos.DeviceDTO;
import com.project.Device_Microservice.exceptions.DeviceNotFoundException;
import com.project.Device_Microservice.services.DeviceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping(value = "/device")
public class DeviceController {

    private final DeviceService deviceService;

    @Autowired
    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @GetMapping()
    public ResponseEntity<List<DeviceDTO>> getDevices() {
        List<DeviceDTO> dtos = deviceService.findDevices();
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<Integer> insertDevice(@Valid @RequestBody DeviceCreateDTO deviceDTO) {
        int deviceID = deviceService.insert(deviceDTO);
        return new ResponseEntity<>(deviceID, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeviceDTO> getDevicesByUser(@PathVariable("id") Long id) {
        DeviceDTO dto = deviceService.findDeviceById(id);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }
    @GetMapping("/{id}/max-hourly-consumption")
    public ResponseEntity<Double> getTotalMaxHourlyEnergyConsumption(@PathVariable long id) {
        double totalMaxConsumption = deviceService.getTotalMaxHourlyEnergyConsumptionById(id);
        return ResponseEntity.ok(totalMaxConsumption);
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DeviceDTO>> getDevicesByUserId(@PathVariable Long userId) {
        List<DeviceDTO> devices = deviceService.findDevicesByUserId(userId);
        return new ResponseEntity<>(devices, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Boolean> updateDevice(@PathVariable int id, @Valid @RequestBody DeviceCreateDTO updatedDeviceDTO) {
        try {
            deviceService.update(id, updatedDeviceDTO);
            return new ResponseEntity<>(Boolean.TRUE, HttpStatus.OK);
        } catch (DeviceNotFoundException e) {
            return new ResponseEntity<>(Boolean.FALSE, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteDevice(@PathVariable Integer id) {
        boolean deleted = deviceService.delete(id);
        return new ResponseEntity<>(deleted ? Boolean.TRUE : Boolean.FALSE, HttpStatus.OK);
    }
}
