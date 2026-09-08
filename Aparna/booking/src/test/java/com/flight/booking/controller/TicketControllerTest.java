package com.flight.booking.controller;

import com.flight.booking.dto.TicketResponse;
import com.flight.booking.exception.ApiException;
import com.flight.booking.service.TicketService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TicketController.class)
class TicketControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TicketService ticketService;

    private TicketResponse sampleTicketResponse() {
        return TicketResponse.builder()
                .ticketId(501L)
                .userId(1L)
                .userFirstName("Aparna")
                .userLastName("Sharma")
                .flightId(101L)
                .flightNumber("M101")
                .fromAirport("JFK")
                .toAirport("LHR")
                .departureTs(LocalDateTime.of(2026, 6, 7, 10, 0))
                .numberOfSeats(2)
                .totalPrice(BigDecimal.valueOf(70000))
                .status("CONFIRMED")
                .build();
    }

    @Test
    @DisplayName("bookTicket - Valid request returns 200 OK and confirmed booking")
    void bookTicket_validRequest_returnsConfirmedBooking() throws Exception {
        // Arrange
        when(ticketService.bookTicket(any())).thenReturn(sampleTicketResponse());

        String jsonRequest = """
            {
              "userId": 1,
              "flightId": 101,
              "numberOfSeats": 2
            }
            """;

        // Act & Assert
        mockMvc.perform(post("/api/tickets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonRequest))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.ticketId").value(501))
            .andExpect(jsonPath("$.status").value("CONFIRMED"))
            .andExpect(jsonPath("$.numberOfSeats").value(2));
    }

    @Test
    @DisplayName("bookTicket - Validation error throws 400 Bad Request")
    void bookTicket_invalidSeats_returnsBadRequest() throws Exception {
        // Arrange
        when(ticketService.bookTicket(any())).thenThrow(new ApiException("Number of seats must be at least 1"));

        String jsonRequest = """
            {
              "userId": 1,
              "flightId": 101,
              "numberOfSeats": 0
            }
            """;

        // Act & Assert
        mockMvc.perform(post("/api/tickets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonRequest))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Number of seats must be at least 1"));
    }

    @Test
    @DisplayName("getTicketsForUser - Valid user ID returns 200 OK and tickets list")
    void getTicketsForUser_validUserId_returnsTicketsList() throws Exception {
        // Arrange
        when(ticketService.getTicketsForUser(1L)).thenReturn(List.of(sampleTicketResponse()));

        // Act & Assert
        mockMvc.perform(get("/api/tickets/user/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].ticketId").value(501))
            .andExpect(jsonPath("$[0].status").value("CONFIRMED"));
    }

    @Test
    @DisplayName("cancelTicket - Valid request returns 200 OK and cancelled ticket")
    void cancelTicket_validRequest_returnsCancelledTicket() throws Exception {
        // Arrange
        TicketResponse cancelledResponse = sampleTicketResponse();
        cancelledResponse.setStatus("CANCELLED");

        when(ticketService.cancelTicket(eq(501L), any())).thenReturn(cancelledResponse);

        // Act & Assert
        mockMvc.perform(patch("/api/tickets/501/cancel")
                .param("userId", "1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.ticketId").value(501))
            .andExpect(jsonPath("$.status").value("CANCELLED"));
    }

    @Test
    @DisplayName("cancelTicket - Missing ticket returns 400 or error status")
    void cancelTicket_missingTicket_returnsErrorStatus() throws Exception {
        // Arrange
        when(ticketService.cancelTicket(eq(999L), any())).thenThrow(new ApiException("Ticket not found: 999"));

        // Act & Assert
        mockMvc.perform(patch("/api/tickets/999/cancel"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Ticket not found: 999"));
    }
}
