package com.example.flight.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "booking_cancellations",
        schema = "flight_booking_system"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingCancellation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cancellation_id")
    private Long cancellationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(name = "cancellation_reason", length = 500)
    private String cancellationReason;

    @Column(
            name = "cancellation_charges",
            precision = 10,
            scale = 2
    )
    private BigDecimal cancellationCharges;

    @Column(
            name = "refund_amount",
            precision = 10,
            scale = 2
    )
    private BigDecimal refundAmount;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;
}