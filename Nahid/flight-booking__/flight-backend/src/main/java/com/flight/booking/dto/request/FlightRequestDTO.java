package com.flight.booking.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlightRequestDTO {

    @NotBlank(message = "Airline code is required")
    private String airlineCode;

    @NotBlank(message = "From airport is required")
    private String fromAirport;

    @NotBlank(message = "To airport is required")
    private String toAirport;

    @NotNull(message = "Departure time is required")
    private LocalDateTime departureTime;

    @NotNull(message = "Arrival time is required")
    private LocalDateTime arrivalTime;

    @Min(value = 0)
    private Short stops;

    @NotNull
    @DecimalMin(value = "0.0")
    private BigDecimal basePrice;

    @Min(value = 1)
    private Short availableSeats;

    @Min(value = 1)
    private Integer durationMinutes;
}