package com.flyora.api.controller;

import com.flyora.api.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ResponseEntity<String> chat(
            @RequestBody ChatRequest request
    ) {

        String response =
                chatService.chat(request.message());

        return ResponseEntity.ok(response);
    }

    public record ChatRequest(String message) {
    }
}