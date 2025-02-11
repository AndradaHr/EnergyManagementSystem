package com.project.Device_Microservice.mappers;

import com.project.Device_Microservice.dtos.UserDTO;
import com.project.Device_Microservice.models.entities.User;

public class UserMapper {
    private UserMapper(){

    }
    public static User toEntity(UserDTO userDto){
        return new User(userDto.getId());
    }
    public static UserDTO toDTO(User user){
        return new UserDTO(user.getId());
    }
}
