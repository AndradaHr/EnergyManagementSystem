package com.project.Monitoring_Microservice.repositories;

import com.project.Monitoring_Microservice.entities.Monitoring;
import com.project.Monitoring_Microservice.dtos.EnergyConsumptionDTO;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface MonitoringRepository extends JpaRepository<Monitoring, Long> {

//    @Query("SELECT new com.project.Monitoring_Microservice.dtos.EnergyConsumptionDTO(HOUR(m.timestamp), SUM(m.measurementValue)) " +
//            "FROM Monitoring m WHERE m.deviceId = :deviceId AND DATE(m.timestamp) = :date " +
//            "GROUP BY HOUR(m.timestamp) ORDER BY HOUR(m.timestamp)")
//    List<EnergyConsumptionDTO> findHourlyConsumptionByDeviceIdAndDate(@Param("deviceId") String deviceId, @Param("date") LocalDate date);
@Query("SELECT new com.project.Monitoring_Microservice.dtos.EnergyConsumptionDTO(MINUTE(m.timestamp), SUM(m.measurementValue)) " +
        "FROM Monitoring m WHERE m.deviceId = :deviceId AND DATE(m.timestamp) = :date " +
        "GROUP BY MINUTE(m.timestamp) ORDER BY MINUTE(m.timestamp)")
List<EnergyConsumptionDTO> findHourlyConsumptionByDeviceIdAndDate(@Param("deviceId") String deviceId, @Param("date") LocalDate date);

    List<Monitoring> findByDeviceId(String deviceId);
}
