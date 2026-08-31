package com.skyroute.dto.ai;

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
public class ChatResponseDto {
    private String response;
    private String sessionId;
    private List<String> toolCallsInvoked;
    private List<Map<String, Object>> suggestedFlights;
    private List<String> quickReplies;
}
