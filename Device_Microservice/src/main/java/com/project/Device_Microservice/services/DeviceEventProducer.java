package com.project.Device_Microservice.services;

import com.project.Device_Microservice.dtos.DeviceDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DeviceEventProducer {

    @Value("${rabbitmq.exchange.name}")
    private String exchangeName;

    @Value("${rabbitmq.routing.json.key}")
    private String routingJsonKey;

    private static final Logger LOGGER = LoggerFactory.getLogger(DeviceEventProducer.class);

    private final RabbitTemplate rabbitTemplate;

    public DeviceEventProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendMessage(DeviceDTO deviceDTO, String actionType) {
        LOGGER.info("Sending message to RabbitMQ with actionType: {}", actionType);

        Map<String, Object> message = new HashMap<>();
        message.put("device", deviceDTO);
        message.put("actionType", actionType);

        rabbitTemplate.convertAndSend(exchangeName, routingJsonKey, message);
    }
}