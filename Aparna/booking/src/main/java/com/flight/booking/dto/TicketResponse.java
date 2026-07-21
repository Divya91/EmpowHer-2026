package com.flight.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketResponse {
    private Long ticketId;
    private Long userId;
    private String userFirstName;
    private String userLastName;
    private String flightId;
    private String flightNumber;
    private String fromAirport;
    private String toAirport;
    private LocalDateTime departureTs;
    private int numberOfSeats;
    private BigDecimal totalPrice;
    private String status;
}
