package com.flight.booking.service;

import com.flight.booking.entity.Flight;
import com.flight.booking.entity.Ticket;
import com.flight.booking.entity.User;
import com.flight.booking.model.Domain;
import com.flight.booking.repository.FlightRepository;
import com.flight.booking.repository.TicketRepository;
import com.flight.booking.repository.UserRepository;
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
class DbGroundingServiceTest {

    @Mock
    private FlightRepository flightRepository;

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private DbGroundingService dbGroundingService;

    private User sampleUser;
    private Flight sampleFlight;
    private Ticket sampleTicket;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .name("Aparna")
                .email("aparna@meridian.com")
                .role("USER")
                .build();

        sampleFlight = Flight.builder()
                .flightId(101L)
                .flightNumber("M101")
                .fromAirport("JFK")
                .toAirport("LHR")
                .departureTs(LocalDateTime.now().plusDays(1))
                .basePrice(BigDecimal.valueOf(35000))
                .seatsLeft(10)
                .airlineName("Meridian Airways")
                .build();

        sampleTicket = Ticket.builder()
                .id(501L)
                .user(sampleUser)
                .flight(sampleFlight)
                .numberOfSeats(2)
                .totalPrice(BigDecimal.valueOf(70000))
                .status("CONFIRMED")
                .build();
    }

    @Test
    @DisplayName("buildDbSnapshot - Flights domain includes live flight inventory")
    void buildDbSnapshot_flightsDomain_returnsFlightData() {
        // Arrange
        when(flightRepository.findAll()).thenReturn(List.of(sampleFlight));

        // Act
        String snapshot = dbGroundingService.buildDbSnapshot(Domain.FLIGHTS_SEARCH, null);

        // Assert
        assertTrue(snapshot.contains("Flight M101"));
        assertTrue(snapshot.contains("JFK -> LHR"));
        assertTrue(snapshot.contains("Seats Left: 10"));
    }

    @Test
    @DisplayName("buildDbSnapshot - Bookings domain with userId includes only that user's tickets")
    void buildDbSnapshot_bookingsDomainWithUser_returnsOnlyUserBookings() {
        // Arrange
        when(flightRepository.findAll()).thenReturn(List.of(sampleFlight));
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(ticketRepository.findByUserId(1L)).thenReturn(List.of(sampleTicket));

        // Act
        String snapshot = dbGroundingService.buildDbSnapshot(Domain.BOOKINGS_TICKETS, 1L);

        // Assert
        assertTrue(snapshot.contains("Customer Bookings for User 1"));
        assertTrue(snapshot.contains("Ticket #501"));
        verify(ticketRepository, times(1)).findByUserId(1L);
        verify(ticketRepository, never()).findByUserId(2L);
    }
}
