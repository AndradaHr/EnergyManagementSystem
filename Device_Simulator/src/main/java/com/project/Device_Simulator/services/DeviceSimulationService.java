package com.project.Device_Simulator.services;

import com.project.Device_Simulator.simulators.SmartMeterSimulator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DeviceSimulationService {

    private final SmartMeterSimulator smartMeterSimulator;

    @Autowired
    public DeviceSimulationService(SmartMeterSimulator smartMeterSimulator) {
        this.smartMeterSimulator = smartMeterSimulator;
    }

//    public boolean simulateDevice(String deviceId) {
//        try {
//            smartMeterSimulator.startSimulation(deviceId);
//            return true;
//        } catch (Exception e) {
//            e.printStackTrace();
//            return false;
//        }
//    }
public boolean simulateDevice(String deviceId) {
    try {
        smartMeterSimulator.startSimulation(deviceId);
        return true;
    } catch (Exception e) {
        e.printStackTrace();
        return false;
    }
}

    public boolean stopSimulation(String deviceId) {
        try {
            smartMeterSimulator.stopSimulation(deviceId);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}

