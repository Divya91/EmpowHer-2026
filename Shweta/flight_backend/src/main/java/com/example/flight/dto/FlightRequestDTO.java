package com.example.flight.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.flight.entity.FlightStatus;

@Data
public class FlightRequestDTO {

    @NotBlank(message = "Airline code is required")
    private String airlineCode;

    @NotBlank(message = "Source airport code is required")
    private String fromAirport;

    @NotBlank(message = "Destination airport code is required")
    private String toAirport;

    @NotNull(message = "Departure time is required")
    private LocalDateTime departureTs;

    @NotNull(message = "Arrival time is required")
    private LocalDateTime arrivalTs;

    @NotNull(message = "Stops is required")
    @Min(value = 0, message = "Stops cannot be negative")
    private Short stops;

    @NotNull(message = "Base price is required")
    @Min(value = 0, message = "Base price cannot be negative")
    private BigDecimal basePrice;

    @NotNull(message = "Available seats is required")
    @Min(value = 1, message = "Available seats must be greater than zero")
    private Short availableSeats;

    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be greater than zero")
    private Integer durationMins;
    private String flightNumber;
    private FlightStatus status;
}