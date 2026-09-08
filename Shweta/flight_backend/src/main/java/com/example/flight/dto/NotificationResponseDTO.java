package com.example.flight.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationResponseDTO {

    private Long notificationId;

    private Long userId;

    private Long bookingId;

    private String type;

    private String channel;

    private String message;

    private String status;

    private LocalDateTime createdAt;
}