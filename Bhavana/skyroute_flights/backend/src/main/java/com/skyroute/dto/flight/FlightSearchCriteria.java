package com.skyroute.dto.flight;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlightSearchCriteria {
    @NotBlank(message = "Origin airport code is required")
    private String origin;

    @NotBlank(message = "Destination airport code is required")
    private String destination;

    @NotNull(message = "Departure date is required")
    private LocalDate departureDate;

    private LocalDate returnDate;

    @Builder.Default
    private Integer passengers = 1;

    @Builder.Default
    private String cabinClass = "ECONOMY"; // ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST

    private String airlineCode;
    private Double maxPrice;
    private Boolean nonStopOnly;
}
