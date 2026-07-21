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
public class FlightResponse {
    private String flightId;
    private String flightNumber;
    private String airlineCode;
    private String airlineName;
    private String fromAirport;
    private String toAirport;
    private LocalDateTime departureTs;
    private LocalDateTime arrivalTs;
    private int stops;
    private int durationMins;
    private BigDecimal basePrice;
    private String aircraft;
    private int seatsLeft;
}
