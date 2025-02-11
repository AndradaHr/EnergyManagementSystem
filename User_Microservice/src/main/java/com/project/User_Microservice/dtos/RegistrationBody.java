package com.project.User_Microservice.dtos;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegistrationBody {

        @NotNull
        @NotBlank
        private String name;
        @NotNull
        @NotBlank
        @Size(min=3, max=255)
        private String username;
        @NotNull
        @NotBlank
        @Email
        private String email;
        @NotNull
        @NotBlank
        @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$")
        @Size(min=6, max=32)
        private String password;
    }
