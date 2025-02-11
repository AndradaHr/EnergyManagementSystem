package com.project.User_Microservice.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginBody {
    @NotBlank
    @NotNull
    private String username;

    @NotBlank
    @NotNull
    private String password;
}
