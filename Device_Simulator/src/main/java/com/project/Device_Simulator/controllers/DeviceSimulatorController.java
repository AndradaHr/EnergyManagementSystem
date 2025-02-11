package com.project.Device_Simulator.controllers;

import com.project.Device_Simulator.services.DeviceSimulationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.FileWriter;
import java.io.IOException;

@RestController
@CrossOrigin("*")
@RequestMapping("/simulator")
public class DeviceSimulatorController {

    private final DeviceSimulationService deviceSimulationService;

    @Autowired
    public DeviceSimulatorController(DeviceSimulationService deviceSimulationService) {
        this.deviceSimulationService = deviceSimulationService;
    }

    @PostMapping("/simulate")
    public String generateConfigAndSimulate(@RequestParam String deviceId) {
        try (FileWriter writer = new FileWriter("Device_Simulator/src/main/resources/sensor.properties")) {
            writer.write("device.id=" + deviceId + "\n");
        } catch (IOException e) {
            e.printStackTrace();
            return "Error generating configuration file.";
        }

        boolean simulationStarted = deviceSimulationService.simulateDevice(deviceId);
        if (simulationStarted) {
            return "Configuration file generated and simulation started successfully.";
        } else {
            return "Configuration file generated, but error starting simulation.";
        }
    }

    @GetMapping("/stop")
    public ResponseEntity<String> stopSimulation(@RequestParam String deviceId) {
        boolean stopped = deviceSimulationService.stopSimulation(deviceId);

        if (stopped) {
            return ResponseEntity.ok("Simularea pentru deviceId " + deviceId + " a fost oprită cu succes.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Nu s-a găsit o simulare activă pentru deviceId " + deviceId + ".");
        }
    }
}
