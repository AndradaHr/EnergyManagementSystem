package com.project.User_Microservice.controllers;

import com.project.User_Microservice.configs.ConfigRestTemplate;
import com.project.User_Microservice.dtos.RegistrationBody;
import com.project.User_Microservice.dtos.UserDTO;
import com.project.User_Microservice.models.enums.Role;
import com.project.User_Microservice.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@CrossOrigin("*")
public class UserController {

    private final UserService userService;
    private final RestTemplate restTemplate;
    private final ConfigRestTemplate configRestTemplate;

    @Autowired
    public UserController(UserService userService, RestTemplate restTemplate, ConfigRestTemplate configRestTemplate) {
        this.userService = userService;
        this.restTemplate = restTemplate;
        this.configRestTemplate = configRestTemplate;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getUsers() {
        List<UserDTO> dtos = userService.findUsers();
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @PostMapping("/user")
    public ResponseEntity<Long> insertUser(@Valid @RequestBody RegistrationBody registrationBody) {
        Long userId = userService.insert(registrationBody);
        String deviceServiceUrl = configRestTemplate.getDeviceServiceUrl() + "/user";
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<?> requestEntity = new HttpEntity<>(userId, headers);
        ResponseEntity<Boolean> response =  restTemplate.exchange(deviceServiceUrl, HttpMethod.POST, requestEntity, Boolean.class);

        return new ResponseEntity<>(userId, HttpStatus.CREATED);
    }

    @GetMapping("user/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable("id") Long userId) {
        UserDTO dto = userService.findUserById(userId);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @PutMapping("user/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable("id") long id,
            @Valid @RequestBody RegistrationBody userUpdateDTO) {

        UserDTO updatedUser = userService.updateUser(id, userUpdateDTO);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @DeleteMapping("user/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") long id) throws URISyntaxException {
        userService.deleteUser(id);
        RestTemplate restTemplate = new RestTemplate();

        String deviceServiceUrl = configRestTemplate.getDeviceServiceUrl() + "/user/" + id;
        RequestEntity<?> requestEntity = RequestEntity.delete(new URI(deviceServiceUrl)).build();

        ResponseEntity<Boolean> response =  restTemplate.exchange(requestEntity, Boolean.class);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("user/role/{username}")
    public ResponseEntity<String> getUserRoleByUsername(@PathVariable String username) {
        Role role = userService.findUserRoleByUsername(username);
        if (role != null) {
            return new ResponseEntity<>(role.name(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


}
