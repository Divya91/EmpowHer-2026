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

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final FlightService flightService;
    private final UserService userService;

    public TicketResponse bookTicket(TicketRequest request) {
        if (request.getNumberOfSeats() < 1) {
            throw new ApiException("Number of seats must be at least 1");
        }

        User user = userService.getUserOrThrow(request.getUserId());
        Flight flight = flightService.getFlightOrThrow(request.getFlightId());

        flightService.reserveSeats(flight, request.getNumberOfSeats());

        BigDecimal totalPrice = flight.getBasePrice().multiply(BigDecimal.valueOf(request.getNumberOfSeats()));

        Ticket ticket = Ticket.builder()
                .user(user)
                .flight(flight)
                .numberOfSeats(request.getNumberOfSeats())
                .totalPrice(totalPrice)
                .bookingTime(LocalDateTime.now())
                .status("CONFIRMED")
                .build();

        return toResponse(ticketRepository.save(ticket));
    }

    public List<TicketResponse> getTicketsForUser(Long userId) {
        return ticketRepository.findByUserId(userId).stream().map(this::toResponse).toList();
    }

    private TicketResponse toResponse(Ticket ticket) {
        String[] nameParts = ticket.getUser().getName().trim().split("\\s+", 2);

        return TicketResponse.builder()
                .ticketId(ticket.getId())
                .userId(ticket.getUser().getId())
                .userFirstName(nameParts[0])
                .userLastName(nameParts.length > 1 ? nameParts[1] : "")
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
