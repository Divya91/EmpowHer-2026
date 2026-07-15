package com.flight.booking.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "airlines", schema = "flight_booking_system")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Airline {

    @Id
    @Column(name = "airline_code", length = 3)
    private String airlineCode;

    @Column(name = "name", nullable = false, length = 200)
    private String name;
}