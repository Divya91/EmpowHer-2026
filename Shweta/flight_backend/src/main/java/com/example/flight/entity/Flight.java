package com.example.flight.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "flights")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "flight_id")
    private Long flightId;

    @Column(name = "flight_number", nullable = false, unique = true)
    private String flightNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "airline_code",
        referencedColumnName = "airline_code"
    )
    private Airline airline;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "from_airport",
        referencedColumnName = "airport_code"
    )
    private Airport fromAirport;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "to_airport",
        referencedColumnName = "airport_code"
    )
    private Airport toAirport;

    @Column(name = "departure_ts", nullable = false)
    private LocalDateTime departureTs;

    @Column(name = "arrival_ts", nullable = false)
    private LocalDateTime arrivalTs;

    @Column(name = "stops")
    private Short stops;

    @Column(name = "base_price", nullable = false)
    private BigDecimal basePrice;

    @Column(name = "available_seats", nullable = false)
    private Short availableSeats;

    @Column(name = "duration_mins")
    private Integer durationMins;
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
     private FlightStatus status;
}