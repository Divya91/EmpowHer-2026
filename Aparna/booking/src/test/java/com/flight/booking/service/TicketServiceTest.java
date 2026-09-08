package com.flight.booking.service;

import com.flight.booking.dto.TicketRequest;
import com.flight.booking.dto.TicketResponse;
import com.flight.booking.entity.Flight;
import com.flight.booking.entity.Ticket;
import com.flight.booking.entity.User;
import com.flight.booking.exception.ApiException;
import com.flight.booking.repository.TicketRepository;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TicketServiceTest {

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private FlightService flightService;

    @Mock
    private UserService userService;

    @InjectMocks
    private TicketService ticketService;

    private User sampleUser;
    private Flight sampleFlight;
    private Ticket sampleTicket;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .name("Aparna Sharma")
                .email("aparna@meridian.com")
                .password("secret")
                .role("USER")
                .build();

        sampleFlight = Flight.builder()
                .flightId(101L)
                .flightNumber("M101")
                .fromAirport("JFK")
                .toAirport("LHR")
                .departureTs(LocalDateTime.now().plusDays(1))
                .arrivalTs(LocalDateTime.now().plusDays(1).plusHours(7))
                .basePrice(BigDecimal.valueOf(35000))
                .seatsLeft(10)
                .build();

        sampleTicket = Ticket.builder()
                .id(501L)
                .user(sampleUser)
                .flight(sampleFlight)
                .numberOfSeats(2)
                .totalPrice(BigDecimal.valueOf(70000))
                .bookingTime(LocalDateTime.now())
                .status("CONFIRMED")
                .build();
    }

    @Test
    @DisplayName("bookTicket - Valid request creates CONFIRMED ticket")
    void bookTicket_validRequest_createsConfirmedTicket() {
        // Arrange
        TicketRequest request = TicketRequest.builder()
                .userId(1L)
                .flightId(101L)
                .numberOfSeats(2)
                .build();

        when(userService.getUserOrThrow(1L)).thenReturn(sampleUser);
        when(flightService.getFlightOrThrow(101L)).thenReturn(sampleFlight);
        when(ticketRepository.save(any(Ticket.class))).thenReturn(sampleTicket);

        // Act
        TicketResponse response = ticketService.bookTicket(request);

        // Assert
        assertNotNull(response);
        assertEquals(501L, response.getTicketId());
        assertEquals("CONFIRMED", response.getStatus());
        assertEquals(BigDecimal.valueOf(70000), response.getTotalPrice());
        verify(flightService, times(1)).reserveSeats(sampleFlight, 2);
    }

    @Test
    @DisplayName("bookTicket - Zero seats throws ApiException")
    void bookTicket_zeroSeats_throwsApiException() {
        // Arrange
        TicketRequest request = TicketRequest.builder()
                .userId(1L)
                .flightId(101L)
                .numberOfSeats(0)
                .build();

        // Act & Assert
        ApiException ex = assertThrows(ApiException.class, () -> ticketService.bookTicket(request));
        assertTrue(ex.getMessage().contains("must be at least 1"));
    }

    @Test
    @DisplayName("getTicketsForUser - Valid userId returns user tickets")
    void getTicketsForUser_validUserId_returnsUserTickets() {
        // Arrange
        when(ticketRepository.findByUserId(1L)).thenReturn(List.of(sampleTicket));

        // Act
        List<TicketResponse> result = ticketService.getTicketsForUser(1L);

        // Assert
        assertEquals(1, result.size());
        assertEquals(501L, result.get(0).getTicketId());
    }

    @Test
    @DisplayName("cancelTicket - Valid request cancels ticket and releases seats")
    void cancelTicket_validRequest_cancelsTicketAndReleasesSeats() {
        // Arrange
        when(ticketRepository.findById(501L)).thenReturn(Optional.of(sampleTicket));
        when(ticketRepository.save(any(Ticket.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        TicketResponse response = ticketService.cancelTicket(501L, 1L);

        // Assert
        assertEquals("CANCELLED", response.getStatus());
        verify(flightService, times(1)).releaseSeats(sampleFlight, 2);
    }

    @Test
    @DisplayName("cancelTicket - Already cancelled ticket throws ApiException")
    void cancelTicket_alreadyCancelled_throwsApiException() {
        // Arrange
        sampleTicket.setStatus("CANCELLED");
        when(ticketRepository.findById(501L)).thenReturn(Optional.of(sampleTicket));

        // Act & Assert
        ApiException ex = assertThrows(ApiException.class, () -> ticketService.cancelTicket(501L, 1L));
        assertTrue(ex.getMessage().contains("already cancelled"));
    }

    @Test
    @DisplayName("cancelTicket - Cancellation by wrong user throws ApiException")
    void cancelTicket_wrongUser_throwsApiException() {
        // Arrange
        when(ticketRepository.findById(501L)).thenReturn(Optional.of(sampleTicket));

        // Act & Assert
        ApiException ex = assertThrows(ApiException.class, () -> ticketService.cancelTicket(501L, 999L));
        assertTrue(ex.getMessage().contains("belonging to another user"));
    }
}
