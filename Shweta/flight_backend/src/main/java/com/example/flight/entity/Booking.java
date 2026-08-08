package com.example.flight.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "bookings",
        schema = "flight_booking_system"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Long bookingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;

    @Column(
            name = "booking_code",
            length = 6,
            unique = true,
            nullable = false
    )
    private String bookingCode;

    @Column(
            name = "status",
            length = 50,
            nullable = false
    )
    private String status;

    @Column(
            name = "payment_status",
            length = 50,
            nullable = false
    )
    private String paymentStatus;

    @Column(
            name = "total_amount",
            precision = 10,
            scale = 2,
            nullable = false
    )
    private BigDecimal totalAmount;

    @Column(name = "booking_ts")
    private LocalDateTime bookingTs;
}
