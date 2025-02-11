package com.project.Chat_Microservice.controllers;

import com.project.Chat_Microservice.entities.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@Controller
@CrossOrigin("*")
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessage chatMessage) {
        System.out.println("Received message: " + chatMessage);

        if (!"Admin".equals(chatMessage.getSender())) {
            messagingTemplate.convertAndSend(
                    "/topic/admin/" + chatMessage.getUserId(),
                    chatMessage
            );
        }
    }

    @MessageMapping("/chat.addUser")
    public void addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        System.out.println(chatMessage.getSender() + " joined the chat.");
    }

    @MessageMapping("/chat.typing")
    public void notifyTyping(@Payload ChatMessage chatMessage) {
        System.out.println("Typing notification received from: " + chatMessage.getSender());

        if (!"Admin".equals(chatMessage.getSender())) {
            messagingTemplate.convertAndSend(
                    "/topic/admin/" + chatMessage.getUserId() + "/typing",
                    chatMessage
            );
        }

        if ("Admin".equals(chatMessage.getSender())) {
            messagingTemplate.convertAndSend(
                    "/topic/user/" + chatMessage.getUserId() + "/typing",
                    chatMessage
            );
        }
    }

    @MessageMapping("/chat.adminToUser")
    public void adminToUser(@Payload ChatMessage chatMessage) {
        messagingTemplate.convertAndSend(
                "/topic/user/" + chatMessage.getUserId() + "/messages",
                chatMessage
        );
    }

    @MessageMapping("/chat.messageRead")
    public void messageRead(@Payload ChatMessage chatMessage) {
        System.out.println("Read notification received for message: " + chatMessage);

        if ("Admin".equals(chatMessage.getSender())) {
            messagingTemplate.convertAndSend(
                    "/topic/user/" + chatMessage.getUserId() + "/messageRead",
                    chatMessage
            );
        } else {
            messagingTemplate.convertAndSend(
                    "/topic/admin/" + chatMessage.getUserId() + "/messageRead",
                    chatMessage
            );
        }
    }
}
