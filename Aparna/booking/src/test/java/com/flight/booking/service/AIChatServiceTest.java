package com.flight.booking.service;

import com.flight.booking.dto.ChatRequest;
import com.flight.booking.dto.ChatResponse;
import com.flight.booking.model.Domain;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AIChatServiceTest {

    @Mock
    private KnowledgeService knowledgeService;

    @Mock
    private DbGroundingService dbGroundingService;

    @InjectMocks
    private AIChatService aiChatService;

    @BeforeEach
    void setUp() {
    }

    @Test
    @DisplayName("buildPrompt - Assembles prompt with strict context constraint directive")
    void buildPrompt_validInputs_includesStrictGroundedDirective() {
        // Act
        String prompt = aiChatService.buildPrompt("Static Text", "Live DB Text", "How do I book?");

        // Assert
        assertNotNull(prompt);
        assertTrue(prompt.contains("Answer the question using ONLY the supplied context below."));
        assertTrue(prompt.contains("If the context is insufficient, explicitly state that you do not know"));
        assertTrue(prompt.contains("Static Text"));
        assertTrue(prompt.contains("Live DB Text"));
    }

    @Test
    @DisplayName("processChat - Valid request generates grounded response")
    void processChat_validRequest_returnsGroundedResponse() {
        // Arrange
        ChatRequest request = ChatRequest.builder()
                .domain(Domain.BOOKINGS_TICKETS)
                .message("How do I cancel a booking?")
                .userId(1L)
                .build();

        when(knowledgeService.getKnowledgeForDomain(Domain.BOOKINGS_TICKETS)).thenReturn("Cancellation policy");
        when(knowledgeService.getFaqForDomain(Domain.BOOKINGS_TICKETS)).thenReturn("FAQ text");
        when(dbGroundingService.buildDbSnapshot(Domain.BOOKINGS_TICKETS, 1L)).thenReturn("DB snapshot");

        // Act
        ChatResponse response = aiChatService.processChat(request);

        // Assert
        assertNotNull(response);
        assertEquals(Domain.BOOKINGS_TICKETS, response.getDomain());
        assertTrue(response.getAnswer().contains("cancel"));
    }
}
