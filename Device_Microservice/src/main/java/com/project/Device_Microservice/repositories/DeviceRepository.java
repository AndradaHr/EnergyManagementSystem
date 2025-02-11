package com.project.Device_Microservice.repositories;

import com.project.Device_Microservice.models.entities.Device;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeviceRepository extends JpaRepository<Device, Long> {
    List<Device> findByUserId(Long userId);
}
