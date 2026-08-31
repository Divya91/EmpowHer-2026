package com.flight.booking.controller;

import com.flight.booking.dto.ChatResponse;
import com.flight.booking.exception.ApiException;
import com.flight.booking.model.Domain;
import com.flight.booking.service.AIChatService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ChatController.class)
class ChatControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AIChatService aiChatService;

    @Test
    @DisplayName("getDomains - Returns 200 OK and list of available chat domains")
    void getDomains_validRequest_returns200AndDomainsList() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/chat/domains"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].code").value("FLIGHTS_SEARCH"))
            .andExpect(jsonPath("$[0].displayName").value("Flights & Search"));
    }

    @Test
    @DisplayName("chat - Valid request returns 200 OK and grounded response")
    void chat_validRequest_returns200AndGroundedResponse() throws Exception {
        // Arrange
        ChatResponse chatResponse = ChatResponse.builder()
                .conversationId("conv-123")
                .domain(Domain.FLIGHTS_SEARCH)
                .answer("Meridian offers flexible flight search.")
                .build();

        when(aiChatService.processChat(any())).thenReturn(chatResponse);

        String jsonRequest = """
            {
              "conversationId": "conv-123",
              "domain": "FLIGHTS_SEARCH",
              "message": "How do I filter flights?"
            }
            """;

        // Act & Assert
        mockMvc.perform(post("/api/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonRequest))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.conversationId").value("conv-123"))
            .andExpect(jsonPath("$.domain").value("FLIGHTS_SEARCH"))
            .andExpect(jsonPath("$.answer").value("Meridian offers flexible flight search."));
    }

    @Test
    @DisplayName("chat - Missing message returns 400 Bad Request")
    void chat_missingMessage_returns400BadRequest() throws Exception {
        // Arrange
        String jsonRequest = """
            {
              "domain": "FLIGHTS_SEARCH",
              "message": ""
            }
            """;

        // Act & Assert
        mockMvc.perform(post("/api/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonRequest))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Message cannot be empty"));
    }
}
