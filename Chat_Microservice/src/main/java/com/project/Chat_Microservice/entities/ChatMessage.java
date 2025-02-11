package com.project.Chat_Microservice.entities;

import lombok.*;

import java.time.LocalTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessage {
    private String sender;
    private String message;
    private String userId;
    private LocalTime date;
    private MessageType type;
}
