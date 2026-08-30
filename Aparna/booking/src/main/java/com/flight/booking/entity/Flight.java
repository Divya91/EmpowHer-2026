package com.flight.booking.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Flights", schema = "flight_booking_system")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Flight {

    @Id
    @jakarta.persistence.Column(name = "flight_id")
    private Long flightId;

    @jakarta.persistence.Column(name = "flight_number")
    private String flightNumber;

    @jakarta.persistence.Column(name = "airline_code")
    private String airlineCode;

    @jakarta.persistence.Column(name = "airline_name")
    private String airlineName;

    @jakarta.persistence.Column(name = "from_airport")
    private String fromAirport;

    @jakarta.persistence.Column(name = "to_airport")
    private String toAirport;

    @jakarta.persistence.Column(name = "departure_ts")
    private LocalDateTime departureTs;

    @jakarta.persistence.Column(name = "arrival_ts")
    private LocalDateTime arrivalTs;

    @jakarta.persistence.Column(name = "stops")
    private int stops;

    @jakarta.persistence.Column(name = "duration_mins")
    private int durationMins;

    @jakarta.persistence.Column(name = "base_price")
    private BigDecimal basePrice;

    @jakarta.persistence.Column(name = "aircraft")
    private String aircraft;

    @jakarta.persistence.Column(name = "available_seats")
    private int seatsLeft;
}
