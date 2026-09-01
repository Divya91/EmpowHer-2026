package com.flight.booking.dto.search;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlightSearchCriteria {

    private String fromAirport;

    private String toAirport;

    private LocalDate departureDate;

    private BigDecimal maxPrice;

    private Short stops;

    private String airlineCode;

}