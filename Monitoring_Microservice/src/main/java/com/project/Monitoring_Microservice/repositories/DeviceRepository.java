package com.project.Monitoring_Microservice.repositories;

import com.project.Monitoring_Microservice.entities.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeviceRepository extends JpaRepository<Device, String> {
    void deleteByDeviceId(Long deviceId);
    Optional<Device> findByDeviceId(Long deviceId);
}
