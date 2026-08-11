package com.example.flight.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "seat_locks",
        schema = "flight_booking_system"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeatLock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seat_lock_id")
    private Long seatLockId;


    // Which flight does this seat belong to?
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "flight_id",
            nullable = false
    )
    private Flight flight;


    // Which booking?
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "booking_id",
            nullable = false
    )
    private Booking booking;


    // Which segment of the booking?
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "segment_id",
            nullable = false
    )
    private BookingSegment bookingSegment;


    // Which passenger gets this seat?
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "passenger_id",
            nullable = false
    )
    private Passenger passenger;


    // Backend-generated seat number
    @Column(
            name = "seat_number",
            length = 10,
            nullable = false
    )
    private String seatNumber;


    @Enumerated(EnumType.STRING)
    @Column(
            name = "status",
            length = 20,
            nullable = false
    )
    private SeatLockStatus status;


    // When the seat was locked
    @Column(name = "locked_at")
    private LocalDateTime lockedAt;


    // When the temporary lock expires
    @Column(name = "locked_until")
    private LocalDateTime lockedUntil;
}

