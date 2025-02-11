package com.project.Device_Microservice.controllers;

import com.project.Device_Microservice.dtos.UserDTO;
import com.project.Device_Microservice.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping(value = "/user")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping()
    public ResponseEntity<List<UserDTO>> getUsers() {
        List<UserDTO> dtos = userService.findUsers();
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<Boolean> insertUser(@Valid @RequestBody UserDTO userDetailsDTO) {
        Boolean insertResponse = userService.insert(userDetailsDTO);
        return new ResponseEntity<>(insertResponse, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteUser(@PathVariable Integer id) {
        boolean deleted = userService.delete(id);
        return new ResponseEntity<>(deleted ? Boolean.TRUE : Boolean.FALSE, HttpStatus.OK);
    }
}
