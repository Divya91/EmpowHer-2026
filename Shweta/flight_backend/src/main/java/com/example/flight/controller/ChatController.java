package com.example.flight.controller;

import com.example.flight.model.ChatRequest;
import com.example.flight.model.ChatResponse;
import com.example.flight.service.AIChatService;
import com.example.flight.service.DomainService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final AIChatService aiChatService;
    private final DomainService domainService;

    public ChatController(
            AIChatService aiChatService,
            DomainService domainService) {

        this.aiChatService = aiChatService;
        this.domainService = domainService;
    }

    @GetMapping("/domains")
    public List<DomainResponse> getDomains() {
        return domainService.getAllDomains();
    }

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest request) {
        return aiChatService.chat(request);
    }
}