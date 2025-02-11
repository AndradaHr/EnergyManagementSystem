//package com.project.Device_Simulator;
//
//import org.springframework.boot.SpringApplication;
//import org.springframework.boot.autoconfigure.SpringBootApplication;
//import org.springframework.scheduling.annotation.EnableScheduling;
//
//@SpringBootApplication
//@EnableScheduling
//public class DeviceSimulatorApplication {
//
//	public static void main(String[] args) {
//		SpringApplication.run(DeviceSimulatorApplication.class, args);
//	}
//
//}
package com.project.Device_Simulator;

import com.project.Device_Simulator.simulators.SmartMeterSimulator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DeviceSimulatorApplication implements CommandLineRunner {

	@Autowired
	private SmartMeterSimulator simulator;

	public static void main(String[] args) {
		SpringApplication.run(DeviceSimulatorApplication.class, args);
	}

	@Override
	public void run(String... args) {
		String propertiesFilePath = "Device_Simulator/src/main/resources/sensor.properties";
		simulator.initializeSimulations(propertiesFilePath);
	}
}
