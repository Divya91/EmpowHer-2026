package com.skyroute.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cancellations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cancellation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "cancellation_reason", nullable = false, length = 100)
    private String cancellationReason;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @Column(name = "ticket_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal ticketAmount;

    @Column(name = "cancellation_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal cancellationFee;

    @Column(name = "refund_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal refundAmount;

    @Column(name = "cancellation_status", length = 30)
    @Builder.Default
    private String cancellationStatus = "CONFIRMED";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
