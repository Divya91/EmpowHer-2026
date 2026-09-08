package com.example.flight.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class NotificationRequestDTO {

    @NotNull(message = "User ID is required")
    private Long userId;

    private Long bookingId;

    @NotBlank(message = "Notification type is required")
    @Size(max = 50)
    private String type;

    @NotBlank(message = "Notification channel is required")
    @Size(max = 50)
    private String channel;

    @NotBlank(message = "Notification message is required")
    private String message;

    @Size(max = 50)
    private String status;
}