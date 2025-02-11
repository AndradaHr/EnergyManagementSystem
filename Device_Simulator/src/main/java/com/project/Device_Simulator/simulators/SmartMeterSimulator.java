//package com.project.Device_Simulator.simulators;
//
//import com.project.Device_Simulator.producers.RabbitMQJsonProducer;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Component;
//
//import java.io.BufferedReader;
//import java.io.FileReader;
//import java.io.IOException;
//import java.time.LocalDateTime;
//
//@Component
//public class SmartMeterSimulator {
//
//    private final RabbitMQJsonProducer rabbitMQJsonProducer;
//    private BufferedReader reader;
//    private boolean isSimulationRunning = false;
//    private String currentLine;
//    private final String filePath = "Device_Simulator/src/main/resources/sensor.csv";
//    private String deviceId;
//
//    @Autowired
//    public SmartMeterSimulator(RabbitMQJsonProducer rabbitMQJsonProducer) throws IOException {
//        this.rabbitMQJsonProducer = rabbitMQJsonProducer;
//        this.reader = new BufferedReader(new FileReader(filePath));
//    }
//
//    public void startSimulation(String deviceId) {
//        this.deviceId = deviceId;
//        try {
//            this.reader = new BufferedReader(new FileReader(filePath));
//            currentLine = reader.readLine();
//            isSimulationRunning = true;
//            simulate();
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//    }
//
//    @Scheduled(fixedRate = 10000)
//    public void simulate() {
//        if (isSimulationRunning && currentLine != null) {
//            try {
//                double measurementValue = Double.parseDouble(currentLine);
//
//                String message = String.format(
//                        "{\"timestamp\": \"%s\", \"device_id\": \"%s\", \"measurement_value\": %.2f}",
//                        LocalDateTime.now(),
//                        deviceId,
//                        measurementValue
//                );
//
//                rabbitMQJsonProducer.sendMessage(message);
//
//                currentLine = reader.readLine();
//
//                if (currentLine == null) {
//                    reader.close();
//                    reader = new BufferedReader(new FileReader(filePath));
//                    currentLine = reader.readLine();
//                }
//
//            } catch (IOException e) {
//                e.printStackTrace();
//            }
//        }
//    }
//
//    public void stopSimulation() {
//        isSimulationRunning = false;
//    }
//}
package com.project.Device_Simulator.simulators;

import com.project.Device_Simulator.producers.RabbitMQJsonProducer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Properties;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SmartMeterSimulator {

    private final RabbitMQJsonProducer rabbitMQJsonProducer;
    private final ConcurrentHashMap<String, BufferedReader> deviceReaders = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, String> deviceLines = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Boolean> simulationStatus = new ConcurrentHashMap<>();
    private final String filePath = "Device_Simulator/src/main/resources/sensor.csv";

    @Autowired
    public SmartMeterSimulator(RabbitMQJsonProducer rabbitMQJsonProducer) {
        this.rabbitMQJsonProducer = rabbitMQJsonProducer;
    }

    public void initializeSimulations(String propertiesFilePath) {
        try {
            Properties properties = new Properties();
            properties.load(new FileReader(propertiesFilePath));

            properties.forEach((key, value) -> {
                String keyStr = (String) key;
                if (keyStr.startsWith("device.") && keyStr.endsWith(".id")) {
                    String deviceId = (String) value;
                    startSimulation(deviceId);
                }
            });
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void startSimulation(String deviceId) {
        try {
            BufferedReader reader = new BufferedReader(new FileReader(filePath));
            deviceReaders.put(deviceId, reader);
            deviceLines.put(deviceId, reader.readLine());
            simulationStatus.put(deviceId, true);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Scheduled(fixedRate = 10000)
    public void simulate() {
        for (String deviceId : deviceReaders.keySet()) {
            if (Boolean.TRUE.equals(simulationStatus.get(deviceId))) {
                try {
                    BufferedReader reader = deviceReaders.get(deviceId);
                    String currentLine = deviceLines.get(deviceId);

                    if (currentLine != null) {
                        double measurementValue = Double.parseDouble(currentLine);

                        String message = String.format(
                                "{\"timestamp\": \"%s\", \"device_id\": \"%s\", \"measurement_value\": %.2f}",
                                LocalDateTime.now(),
                                deviceId,
                                measurementValue
                        );

                        rabbitMQJsonProducer.sendMessage(message);

                        String nextLine = reader.readLine();
                        if (nextLine == null) {
                            reader.close();
                            reader = new BufferedReader(new FileReader(filePath));
                            nextLine = reader.readLine();
                            deviceReaders.put(deviceId, reader);
                        }
                        deviceLines.put(deviceId, nextLine);
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public void stopSimulation(String deviceId) {
        simulationStatus.put(deviceId, false);
        try {
            BufferedReader reader = deviceReaders.remove(deviceId);
            if (reader != null) reader.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
