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
public class CreateFlightRequest {
    private String flightNumber;
    private String airline;
    private String airlineCode;
    private String fromAirport;
    private String toAirport;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private Integer seatCapacityEconomy;
    private Integer seatCapacityBusiness;
    private BigDecimal basePrice;
    private String aircraft;
}
