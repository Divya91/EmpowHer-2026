package com.example.flight.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "booking_add_ons")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingAddOn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "addon_id")
    private Long addonId;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "booking_id",
            nullable = false
    )
    private Booking booking;


    @Enumerated(EnumType.STRING)
    @Column(
            name = "addon_type",
            nullable = false,
            length = 30
    )
    private AddOnType addonType;


    @Column(length = 255)
    private String description;


    @Column(nullable = false)
    private Integer quantity;


    @Column(name = "unit_price",
            nullable = false)
    private BigDecimal unitPrice;


    @Column(name = "total_price",
            nullable = false)
    private BigDecimal totalPrice;


    @CreationTimestamp
    @Column(name = "created_at",
            updatable = false)
    private LocalDateTime createdAt;
}