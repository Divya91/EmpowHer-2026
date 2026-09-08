package com.skyroute.dto.flight;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlightResponseDto {
    private Long id;
    private Long scheduleId;
    private String flightNumber;
    private String airlineName;
    private String airlineCode;
    private String airlineLogo;
    private String originIata;
    private String originCity;
    private String originAirportName;
    private String destinationIata;
    private String destinationCity;
    private String destinationAirportName;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
    private LocalDate travelDate;
    private LocalDateTime departureDateTime;
    private LocalDateTime arrivalDateTime;
    private Integer durationMinutes;
    private Integer stops;
    private BigDecimal baseFare;
    private BigDecimal taxAmount;
    private BigDecimal totalPrice;
    private Boolean isRefundable;
    private Integer cabinBaggageKg;
    private Integer checkinBaggageKg;
    private Integer availableSeats;
    private String aircraftModel;
    private String cabinClass;
}
