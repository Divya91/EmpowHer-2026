package com.flight.booking.service;

import com.flight.booking.entity.Flight;
import com.flight.booking.entity.Ticket;
import com.flight.booking.entity.User;
import com.flight.booking.model.Domain;
import com.flight.booking.repository.FlightRepository;
import com.flight.booking.repository.TicketRepository;
import com.flight.booking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DbGroundingService {

    private final FlightRepository flightRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public String buildDbSnapshot(Domain domain, Long userId) {
        StringBuilder sb = new StringBuilder("Live Database Snapshot:\n");

        if (domain == Domain.FLIGHTS_SEARCH || domain == Domain.BOOKINGS_TICKETS) {
            List<Flight> flights = flightRepository.findAll();
            sb.append("- Available Flights in System (Total ").append(flights.size()).append("):\n");
            for (Flight f : flights) {
                sb.append("  * Flight ").append(f.getFlightNumber())
                  .append(" (ID: ").append(f.getFlightId()).append("): ")
                  .append(f.getFromAirport()).append(" -> ").append(f.getToAirport())
                  .append(" | Departs: ").append(f.getDepartureTs())
                  .append(" | Price: ₹").append(f.getBasePrice())
                  .append(" | Seats Left: ").append(f.getSeatsLeft())
                  .append(" | Airline: ").append(f.getAirlineName())
                  .append("\n");
            }
        }

        if (userId != null) {
            userRepository.findById(userId).ifPresent(user -> {
                sb.append("- Customer Account Facts:\n");
                sb.append("  * User ID: ").append(user.getId())
                  .append(" | Name: ").append(user.getName())
                  .append(" | Email: ").append(user.getEmail())
                  .append(" | Role: ").append(user.getRole())
                  .append("\n");

                List<Ticket> userTickets = ticketRepository.findByUserId(userId);
                sb.append("- Customer Bookings for User ").append(userId)
                  .append(" (Total ").append(userTickets.size()).append("):\n");
                
                if (userTickets.isEmpty()) {
                    sb.append("  * No bookings recorded for this user.\n");
                } else {
                    for (Ticket t : userTickets) {
                        sb.append("  * Ticket #").append(t.getId())
                          .append(": Flight ").append(t.getFlight().getFlightNumber())
                          .append(" (").append(t.getFlight().getFromAirport()).append(" -> ").append(t.getFlight().getToAirport()).append(")")
                          .append(" | Departs: ").append(t.getFlight().getDepartureTs())
                          .append(" | Seats: ").append(t.getNumberOfSeats())
                          .append(" | Total Price: ₹").append(t.getTotalPrice())
                          .append(" | Status: ").append(t.getStatus())
                          .append("\n");
                    }
                }
            });
        } else {
            sb.append("- User Authentication: Customer is currently not logged in (anonymous guest session).\n");
        }

        return sb.toString();
    }
}
