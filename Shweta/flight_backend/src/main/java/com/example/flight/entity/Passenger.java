package com.example.flight.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(
        name = "passengers",
        schema = "flight_booking_system"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Passenger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "passenger_id")
    private Long passengerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(
            name = "first_name",
            length = 100,
            nullable = false
    )
    private String firstName;

    @Column(
            name = "last_name",
            length = 100,
            nullable = false
    )
    private String lastName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(
            name = "seat_number",
            length = 5
    )
    private String seatNumber;
}