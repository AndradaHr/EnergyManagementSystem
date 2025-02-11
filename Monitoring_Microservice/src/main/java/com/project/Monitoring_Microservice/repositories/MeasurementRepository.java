package com.project.Monitoring_Microservice.repositories;

import com.project.Monitoring_Microservice.entities.Measurement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MeasurementRepository extends JpaRepository<Measurement, Long> {

    Optional<Measurement> findByDeviceId(String deviceId);

}
