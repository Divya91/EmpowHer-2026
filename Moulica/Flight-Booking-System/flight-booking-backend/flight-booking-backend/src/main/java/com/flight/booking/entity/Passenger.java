package com.flight.booking.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "passengers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Passenger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "passenger_id")
    private Long passengerId;

    @Column(name = "booking_id")
    private Long bookingId;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "seat_number")
    private String seatNumber;

    private Integer age;

    private String gender;

    private String nationality;

    @Column(name = "passport_number")
    private String passportNumber;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(unique = true)
    private String email;
}