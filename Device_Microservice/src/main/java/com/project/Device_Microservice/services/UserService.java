package com.project.Device_Microservice.services;

import com.project.Device_Microservice.dtos.UserDTO;
import com.project.Device_Microservice.mappers.UserMapper;
import com.project.Device_Microservice.models.entities.User;
import com.project.Device_Microservice.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserDTO> findUsers() {
        List<User> userList = userRepository.findAll();
        return userList.stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());
    }

    public Boolean insert(UserDTO userDTO) {
        User user = UserMapper.toEntity(userDTO);
        user = userRepository.save(user);
        return Boolean.TRUE;
    }

    @Transactional
    public boolean delete(int id) {
        User existingUser = userRepository.findById((long) id).orElse(null);
        if (existingUser != null) {
            userRepository.delete(existingUser);
            return true;
        } else {
            return false;
        }
    }
}
