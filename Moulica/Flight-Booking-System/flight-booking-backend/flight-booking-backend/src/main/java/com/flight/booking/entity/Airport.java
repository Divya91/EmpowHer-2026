package com.flight.booking.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "airports", schema = "flight_booking_system")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Airport {

    @Id
    @Column(name = "airport_code", length = 3)
    private String airportCode;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "city")
    private String city;

    @Column(name = "country")
    private String country;
}