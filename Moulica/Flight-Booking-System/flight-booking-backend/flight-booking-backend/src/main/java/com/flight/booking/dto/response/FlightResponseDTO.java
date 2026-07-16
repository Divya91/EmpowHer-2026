package com.flight.booking.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlightResponseDTO {

    private Long flightId;

    private String airlineCode;

    private String airlineName;

    private String fromAirport;

    private String toAirport;

    private LocalDateTime departureTime;

    private LocalDateTime arrivalTime;

    private Short stops;

    private BigDecimal basePrice;

    private Short availableSeats;

    private Integer durationMinutes;
}