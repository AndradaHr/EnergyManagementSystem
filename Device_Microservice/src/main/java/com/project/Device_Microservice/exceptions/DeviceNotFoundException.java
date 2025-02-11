package com.project.Device_Microservice.exceptions;


public class DeviceNotFoundException extends RuntimeException{
    public DeviceNotFoundException(String id){
        super("Could not found the user with id "+ id);
    }
}