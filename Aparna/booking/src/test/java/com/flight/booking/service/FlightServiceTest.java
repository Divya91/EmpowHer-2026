package com.flight.booking.service;

import com.flight.booking.dto.FlightResponse;
import com.flight.booking.entity.Flight;
import com.flight.booking.exception.ApiException;
import com.flight.booking.repository.FlightRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FlightServiceTest {

    @Mock
    private FlightRepository flightRepository;

    @InjectMocks
    private FlightService flightService;

    private Flight sampleFlight;

    @BeforeEach
    void setUp() {
        sampleFlight = Flight.builder()
                .flightId(101L)
                .flightNumber("M101")
                .airlineCode("M1")
                .airlineName("Meridian Airways")
                .fromAirport("JFK")
                .toAirport("LHR")
                .departureTs(LocalDateTime.now().plusDays(1))
                .arrivalTs(LocalDateTime.now().plusDays(1).plusHours(7))
                .stops(0)
                .durationMins(420)
                .basePrice(BigDecimal.valueOf(35000))
                .aircraft("Boeing 787")
                .seatsLeft(10)
                .build();
    }

    @Test
    @DisplayName("searchFlights - Null query params returns all flights")
    void searchFlights_nullParams_returnsAllFlights() {
        // Arrange
        when(flightRepository.findAll()).thenReturn(List.of(sampleFlight));

        // Act
        List<FlightResponse> result = flightService.searchFlights(null, null, null);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("M101", result.get(0).getFlightNumber());
        verify(flightRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("searchFlights - Valid airport filter returns matching flights")
    void searchFlights_validFromAndToAirports_returnsMatchingFlights() {
        // Arrange
        when(flightRepository.findByFromAirportIgnoreCaseAndToAirportIgnoreCase("JFK", "LHR"))
                .thenReturn(List.of(sampleFlight));

        // Act
        List<FlightResponse> result = flightService.searchFlights("JFK", "LHR", null);

        // Assert
        assertEquals(1, result.size());
        assertEquals("JFK", result.get(0).getFromAirport());
        assertEquals("LHR", result.get(0).getToAirport());
    }

    @Test
    @DisplayName("getFlightOrThrow - Existing flightId returns entity")
    void getFlightOrThrow_existingFlightId_returnsFlightEntity() {
        // Arrange
        when(flightRepository.findById(101L)).thenReturn(Optional.of(sampleFlight));

        // Act
        Flight result = flightService.getFlightOrThrow(101L);

        // Assert
        assertNotNull(result);
        assertEquals(101L, result.getFlightId());
    }

    @Test
    @DisplayName("getFlightOrThrow - Missing flightId throws ApiException")
    void getFlightOrThrow_missingFlightId_throwsApiException() {
        // Arrange
        when(flightRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        ApiException ex = assertThrows(ApiException.class, () -> flightService.getFlightOrThrow(999L));
        assertTrue(ex.getMessage().contains("Flight not found"));
    }

    @Test
    @DisplayName("reserveSeats - Sufficient seats decrements inventory")
    void reserveSeats_sufficientSeats_decrementsSeatsLeft() {
        // Arrange & Act
        flightService.reserveSeats(sampleFlight, 3);

        // Assert
        assertEquals(7, sampleFlight.getSeatsLeft());
        verify(flightRepository, times(1)).save(sampleFlight);
    }

    @Test
    @DisplayName("reserveSeats - Insufficient seats throws ApiException")
    void reserveSeats_insufficientSeats_throwsApiException() {
        // Act & Assert
        ApiException ex = assertThrows(ApiException.class, () -> flightService.reserveSeats(sampleFlight, 15));
        assertTrue(ex.getMessage().contains("seat(s) left"));
    }

    @Test
    @DisplayName("releaseSeats - Valid seats increments inventory")
    void releaseSeats_validSeats_incrementsSeatsLeft() {
        // Act
        flightService.releaseSeats(sampleFlight, 3);

        // Assert
        assertEquals(13, sampleFlight.getSeatsLeft());
        verify(flightRepository, times(1)).save(sampleFlight);
    }
}
