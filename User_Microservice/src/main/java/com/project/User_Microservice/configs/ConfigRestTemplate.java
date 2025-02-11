package com.project.User_Microservice.configs;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Getter
@Configuration
public class ConfigRestTemplate {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

//    @Value("http://device-management-app:8081")
    @Value("http://device.localhost")
//@Value("http://localhost:8081")
    private String deviceServiceUrl;

}
