package com.example.flight.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Data;

@Data
public class FlightSearchRequestDTO {

    private String source;

    private String destination;

    private LocalDate date;

    private String airline;

    private String flightNumber;

    private Short stops;

    private BigDecimal minPrice;

    private BigDecimal maxPrice;

    private Integer maxDuration;

    private String sortBy;

    private String sortDirection;

    private int page = 0;

    private int size = 10;
}