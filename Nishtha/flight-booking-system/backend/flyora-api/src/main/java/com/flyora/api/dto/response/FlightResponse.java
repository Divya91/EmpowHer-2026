package com.flyora.api.dto.response;

import com.flyora.api.enums.CabinClass;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public class FlightResponse {

    private Long id;
    private String flightNumber;
    private String airline;
    private String fromAirport;
    private String toAirport;
    private LocalDate travelDate;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
    private CabinClass cabinClass;
    private BigDecimal price;
    private Integer availableSeats;

    public FlightResponse(
            Long id,
            String flightNumber,
            String airline,
            String fromAirport,
            String toAirport,
            LocalDate travelDate,
            LocalTime departureTime,
            LocalTime arrivalTime,
            CabinClass cabinClass,
            BigDecimal price,
            Integer availableSeats
    ) {
        this.id = id;
        this.flightNumber = flightNumber;
        this.airline = airline;
        this.fromAirport = fromAirport;
        this.toAirport = toAirport;
        this.travelDate = travelDate;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.cabinClass = cabinClass;
        this.price = price;
        this.availableSeats = availableSeats;
    }

    public Long getId() {
        return id;
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public String getAirline() {
        return airline;
    }

    public String getFromAirport() {
        return fromAirport;
    }

    public String getToAirport() {
        return toAirport;
    }

    public LocalDate getTravelDate() {
        return travelDate;
    }

    public LocalTime getDepartureTime() {
        return departureTime;
    }

    public LocalTime getArrivalTime() {
        return arrivalTime;
    }

    public CabinClass getCabinClass() {
        return cabinClass;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public Integer getAvailableSeats() {
        return availableSeats;
    }
}