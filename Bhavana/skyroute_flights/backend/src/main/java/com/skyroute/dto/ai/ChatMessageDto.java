package com.skyroute.dto.ai;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDto {
    @NotBlank(message = "Message cannot be empty")
    private String message;

    private String sessionId;
    private List<Map<String, String>> history;
}
