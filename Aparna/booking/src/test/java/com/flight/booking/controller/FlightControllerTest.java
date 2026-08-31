package com.flight.booking.controller;

import com.flight.booking.dto.FlightResponse;
import com.flight.booking.exception.ApiException;
import com.flight.booking.service.FlightService;
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
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(FlightController.class)
class FlightControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private FlightService flightService;

    private FlightResponse sampleFlightResponse() {
        return FlightResponse.builder()
                .flightId(101L)
                .flightNumber("M101")
                .airlineCode("M1")
                .airlineName("Meridian Airways")
                .fromAirport("JFK")
                .toAirport("LHR")
                .departureTs(LocalDateTime.of(2026, 6, 7, 10, 0))
                .arrivalTs(LocalDateTime.of(2026, 6, 7, 18, 0))
                .stops(0)
                .durationMins(480)
                .basePrice(BigDecimal.valueOf(35000))
                .aircraft("Boeing 787")
                .seatsLeft(10)
                .build();
    }

    @Test
    @DisplayName("searchFlights - Valid query returns 200 OK and flight list")
    void searchFlights_validQuery_returns200AndFlightList() throws Exception {
        // Arrange
        when(flightService.searchFlights(any(), any(), any())).thenReturn(List.of(sampleFlightResponse()));

        // Act & Assert
        mockMvc.perform(get("/api/flights")
                .param("from", "JFK")
                .param("to", "LHR")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].flightId").value(101))
            .andExpect(jsonPath("$[0].flightNumber").value("M101"))
            .andExpect(jsonPath("$[0].fromAirport").value("JFK"));
    }

    @Test
    @DisplayName("getFlight - Existing flight ID returns 200 OK")
    void getFlight_existingId_returns200AndFlight() throws Exception {
        // Arrange
        when(flightService.getFlightResponseOrThrow(101L)).thenReturn(sampleFlightResponse());

        // Act & Assert
        mockMvc.perform(get("/api/flights/101"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.flightId").value(101))
            .andExpect(jsonPath("$.flightNumber").value("M101"));
    }

    @Test
    @DisplayName("getFlight - Missing flight ID returns 400 or 404 handled error")
    void getFlight_missingId_returnsErrorStatus() throws Exception {
        // Arrange
        when(flightService.getFlightResponseOrThrow(999L)).thenThrow(new ApiException("Flight not found: 999"));

        // Act & Assert
        mockMvc.perform(get("/api/flights/999"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Flight not found: 999"));
    }
}
