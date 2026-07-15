package com.flight.booking.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "flights", schema = "flight_booking_system")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "flight_id")
    private Long flightId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "airline_code", nullable = false)
    private Airline airline;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_airport", nullable = false)
    private Airport fromAirport;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_airport", nullable = false)
    private Airport toAirport;

    @Column(name = "departure_ts", nullable = false)
    private LocalDateTime departureTime;

    @Column(name = "arrival_ts", nullable = false)
    private LocalDateTime arrivalTime;

    @Column(name = "stops")
    private Short stops;

    @Column(name = "base_price", precision = 10, scale = 2)
    private BigDecimal basePrice;

    @Column(name = "available_seats")
    private Short availableSeats;

    @Column(name = "duration_mins")
    private Integer durationMinutes;
}