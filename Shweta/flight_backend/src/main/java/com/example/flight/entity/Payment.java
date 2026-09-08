package com.example.flight.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "payments",
        schema = "flight_booking_system"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Long paymentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(
            name = "payment_method",
            length = 50,
            nullable = false
    )
    private String paymentMethod;

    @Column(
            name = "amount",
            precision = 10,
            scale = 2,
            nullable = false
    )
    private BigDecimal amount;

    @Column(
            name = "status",
            length = 50,
            nullable = false
    )
    private String status;

    @Column(
            name = "transaction_ref",
            length = 100,
            unique = true
    )
    private String transactionRef;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;
}