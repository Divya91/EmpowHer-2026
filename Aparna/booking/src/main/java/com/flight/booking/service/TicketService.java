package com.flight.booking.service;

import com.flight.booking.dto.TicketRequest;
import com.flight.booking.dto.TicketResponse;
import com.flight.booking.entity.Flight;
import com.flight.booking.entity.Ticket;
import com.flight.booking.entity.User;
import com.flight.booking.exception.ApiException;
import com.flight.booking.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final FlightService flightService;
    private final UserService userService;
    private final Random random = new Random();

    @Transactional
    public TicketResponse bookTicket(TicketRequest request) {
        if (request.getNumberOfSeats() < 1) {
            throw new ApiException("Number of seats must be at least 1");
        }

        User user = userService.getUserOrThrow(request.getUserId());
        Flight flight = flightService.getFlightOrThrow(request.getFlightId());

        flightService.reserveSeats(flight, request.getNumberOfSeats());

        BigDecimal totalPrice = flight.getBasePrice().multiply(BigDecimal.valueOf(request.getNumberOfSeats()));
        String bookingCode = "BK" + (100000 + random.nextInt(900000));

        Ticket ticket = Ticket.builder()
                .user(user)
                .flight(flight)
                .bookingCode(bookingCode)
                .numberOfSeats(request.getNumberOfSeats())
                .totalPrice(totalPrice)
                .paymentStatus("PAID")
                .bookingTime(LocalDateTime.now())
                .status("CONFIRMED")
                .build();

        return toResponse(ticketRepository.save(ticket));
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> getTicketsForUser(Long userId) {
        return ticketRepository.findByUserId(userId).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public TicketResponse getTicketOrThrow(Long ticketId) {
        return ticketRepository.findById(ticketId)
                .map(this::toResponse)
                .orElseThrow(() -> new ApiException("Ticket not found: " + ticketId));
    }

    @Transactional
    public TicketResponse cancelTicket(Long ticketId, Long userId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ApiException("Ticket not found: " + ticketId));

        if (userId != null && !ticket.getUser().getId().equals(userId)) {
            throw new ApiException("Cannot cancel ticket belonging to another user");
        }

        if ("CANCELLED".equalsIgnoreCase(ticket.getStatus())) {
            throw new ApiException("Ticket is already cancelled");
        }

        ticket.setStatus("CANCELLED");
        ticket.setPaymentStatus("REFUNDED");
        flightService.releaseSeats(ticket.getFlight(), ticket.getNumberOfSeats());

        return toResponse(ticketRepository.save(ticket));
    }

    private TicketResponse toResponse(Ticket ticket) {
        String fullName = ticket.getUser() != null && ticket.getUser().getName() != null 
                ? ticket.getUser().getName().trim() 
                : "Guest";
        String[] nameParts = fullName.split("\\s+", 2);
        String lastName = ticket.getUser() != null && ticket.getUser().getLastName() != null
                ? ticket.getUser().getLastName()
                : (nameParts.length > 1 ? nameParts[1] : "");

        return TicketResponse.builder()
                .ticketId(ticket.getId())
                .userId(ticket.getUser() != null ? ticket.getUser().getId() : null)
                .userFirstName(nameParts[0])
                .userLastName(lastName)
                .flightId(ticket.getFlight().getFlightId())
                .flightNumber(ticket.getFlight().getFlightNumber())
                .fromAirport(ticket.getFlight().getFromAirport())
                .toAirport(ticket.getFlight().getToAirport())
                .departureTs(ticket.getFlight().getDepartureTs())
                .numberOfSeats(ticket.getNumberOfSeats())
                .totalPrice(ticket.getTotalPrice())
                .status(ticket.getStatus())
                .build();
    }
}
