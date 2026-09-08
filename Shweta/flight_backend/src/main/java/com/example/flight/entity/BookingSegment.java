package com.example.flight.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
    name = "booking_segments",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_booking_segment_order",
            columnNames = {
                "booking_id",
                "segment_order"
            }
        )
    }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingSegment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "segment_id")
    private Long segmentId;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "booking_id",
        nullable = false
    )
    private Booking booking;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "flight_id",
        nullable = false
    )
    private Flight flight;


    @Column(
        name = "segment_order",
        nullable = false
    )
    private Integer segmentOrder;


    @CreationTimestamp
    @Column(
        name = "created_at",
        updatable = false
    )
    private LocalDateTime createdAt;
}