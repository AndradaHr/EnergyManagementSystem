package com.project.User_Microservice.mappers;

import com.project.User_Microservice.dtos.RegistrationBody;
import com.project.User_Microservice.dtos.UserDTO;
import com.project.User_Microservice.models.entities.User;
import com.project.User_Microservice.models.enums.Role;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public static UserDTO toUserDTO(User user) {
        return new UserDTO(user.getId(), user.getName(), user.getUsername(), user.getEmail(), user.getRole().toString());
    }

    public static User toEntity(RegistrationBody registrationBody) {
        User user = new User();
        user.setName(registrationBody.getName());
        user.setUsername(registrationBody.getUsername());
        user.setEmail(registrationBody.getEmail());
        user.setPassword(registrationBody.getPassword());
        user.setRole(Role.USER);
        return user;
    }
}
