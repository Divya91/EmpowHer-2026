package com.flight.booking.controller;

import com.flight.booking.dto.ChatRequest;
import com.flight.booking.dto.ChatResponse;
import com.flight.booking.dto.DomainResponse;
import com.flight.booking.exception.ApiException;
import com.flight.booking.model.Domain;
import com.flight.booking.service.AIChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final AIChatService aiChatService;

    @GetMapping("/domains")
    public List<DomainResponse> getDomains() {
        return Arrays.stream(Domain.values())
                .map(d -> DomainResponse.builder()
                        .code(d.getCode())
                        .displayName(d.getDisplayName())
                        .build())
                .toList();
    }

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest request) {
        if (request == null || request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            throw new ApiException("Message cannot be empty");
        }
        return aiChatService.processChat(request);
    }
}
