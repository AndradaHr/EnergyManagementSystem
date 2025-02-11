package com.project.Device_Microservice.repositories;

import com.project.Device_Microservice.models.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
