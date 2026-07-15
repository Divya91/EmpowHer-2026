package com.flyora.api.entity;

import com.flyora.api.enums.CabinClass;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "flights")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String flightNumber;

    @Column(nullable = false)
    private String airline;

    @Column(nullable = false)
    private String fromAirport;

    @Column(nullable = false)
    private String toAirport;

    @Column(nullable = false)
    private LocalDate travelDate;

    @Column(nullable = false)
    private LocalTime departureTime;

    @Column(nullable = false)
    private LocalTime arrivalTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CabinClass cabinClass;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer availableSeats;
}