package com.example.flight.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.flight.entity.FlightStatus;


@Data
public class FlightResponseDTO {
    private FlightStatus status;

    private Long flightId;

    private String airlineCode;

    private String airlineName;

    private String fromAirport;

    private String toAirport;

    private LocalDateTime departureTs;

    private LocalDateTime arrivalTs;

    private Short stops;

    private BigDecimal basePrice;

    private Short availableSeats;

    private Integer durationMins;
    private String flightNumber;
}