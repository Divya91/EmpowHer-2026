package com.example.flight.entity;



import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "flight_pricing",
        schema = "flight_booking_system"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlightPricing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pricing_id")
    private Long pricingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "flight_id",
            nullable = false
    )
    private Flight flight;

    @Column(name = "base_fare", nullable = false)
    private BigDecimal baseFare;

    @Column(name = "taxes", nullable = false)
    private BigDecimal taxes;

    @Column(name = "convenience_fee", nullable = false)
    private BigDecimal convenienceFee;

    @Column(name = "currency", length = 3)
    private String currency;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Enumerated(EnumType.STRING)
@Column(name = "seat_class", nullable = false, length = 30)
private CabinClass seatClass;
}