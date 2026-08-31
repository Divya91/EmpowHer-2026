package com.skyroute.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "flight_schedules", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"flight_id", "scheduled_departure_date"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlightSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;

    @Column(name = "scheduled_departure_date", nullable = false)
    private LocalDate scheduledDepartureDate;

    @Column(name = "departure_datetime", nullable = false)
    private LocalDateTime departureDatetime;

    @Column(name = "arrival_datetime", nullable = false)
    private LocalDateTime arrivalDatetime;

    @Column(name = "available_economy_seats", nullable = false)
    private Integer availableEconomySeats;

    @Column(name = "available_premium_seats")
    @Builder.Default
    private Integer availablePremiumSeats = 0;

    @Column(name = "available_business_seats")
    @Builder.Default
    private Integer availableBusinessSeats = 0;

    @Column(name = "available_first_seats")
    @Builder.Default
    private Integer availableFirstSeats = 0;

    @Column(name = "current_economy_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal currentEconomyPrice;

    @Column(name = "current_business_price", precision = 10, scale = 2)
    private BigDecimal currentBusinessPrice;

    @Column(length = 30)
    @Builder.Default
    private String status = "SCHEDULED";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
