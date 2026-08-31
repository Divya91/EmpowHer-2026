package com.skyroute.controller;

import com.skyroute.dto.ai.ChatMessageDto;
import com.skyroute.dto.ai.ChatResponseDto;
import com.skyroute.service.AiTravelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI Travel Assistant", description = "AI Assistant with function tool calling for flight searches and policies")
public class AiChatController {

    private final AiTravelService aiTravelService;

    @PostMapping("/chat")
    @Operation(summary = "Interact with SkyRoute AI Assistant with tool calling capabilities")
    public ResponseEntity<ChatResponseDto> chat(
            @Valid @RequestBody ChatMessageDto request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String email = userDetails != null ? userDetails.getUsername() : "guest";
        return ResponseEntity.ok(aiTravelService.processChat(request, email));
    }
}
