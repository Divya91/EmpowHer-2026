package com.flight.booking.dto;

import com.flight.booking.model.Domain;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {
    private String conversationId;
    private Domain domain;
    private String message;
    private Long userId;
}
