package com.flightbooking.controller;

import com.flightbooking.service.ChatbotService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
public class ChatbotController {

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @GetMapping
    public String chat(@RequestParam(value = "message", defaultValue = "Tell me a joke") String message) {
        return chatbotService.chat(message);
    }
}
