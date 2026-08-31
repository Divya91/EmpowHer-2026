package com.skyroute.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "flight_seats", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"schedule_id", "seat_number"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlightSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id", nullable = false)
    private FlightSchedule schedule;

    @Column(name = "seat_number", nullable = false, length = 10)
    private String seatNumber;

    @Column(name = "cabin_class", nullable = false, length = 30)
    private String cabinClass; // ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST

    @Column(name = "seat_type", nullable = false, length = 30)
    private String seatType; // WINDOW, AISLE, MIDDLE, EXTRA_LEGROOM, EMERGENCY_EXIT

    @Column(name = "price_surcharge", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal priceSurcharge = BigDecimal.ZERO;

    @Column(name = "is_booked")
    @Builder.Default
    private Boolean isBooked = false;

    @Column(name = "is_blocked")
    @Builder.Default
    private Boolean isBlocked = false;

    @Version
    @Builder.Default
    private Long version = 0L;
}
