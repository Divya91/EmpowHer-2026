package com.skyroute.entity;

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
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(name = "first_name", nullable = false, length = 60)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 60)
    private String lastName;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(nullable = false, length = 20)
    private String gender;

    @Column(name = "passenger_type", length = 20)
    @Builder.Default
    private String passengerType = "ADULT";

    @Column(name = "passport_number", length = 50)
    private String passportNumber;

    @Column(length = 60)
    @Builder.Default
    private String nationality = "Indian";

    @Column(name = "seat_number", length = 10)
    private String seatNumber;

    @Column(name = "meal_preference", length = 50)
    private String mealPreference;

    @Column(name = "extra_baggage_kg")
    @Builder.Default
    private Integer extraBaggageKg = 0;

    @Column(name = "insurance_opted")
    @Builder.Default
    private Boolean insuranceOpted = false;
}
