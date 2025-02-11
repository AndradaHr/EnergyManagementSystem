package com.project.Monitoring_Microservice.services;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public NotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void notifyUser(Long userId, String message) {
        String destination = "/topic/notifications/"+userId;
        JSONObject jsonMessage = new JSONObject();
        jsonMessage.put("alertMessage", message);

        messagingTemplate.convertAndSend(destination, jsonMessage.toString());
        System.out.println("Notificare trimisă la: " + destination + " cu mesajul: " + jsonMessage.toString());
    }
}
