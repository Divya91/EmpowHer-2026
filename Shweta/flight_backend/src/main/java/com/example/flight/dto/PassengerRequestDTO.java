package com.example.flight.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PassengerRequestDTO {

    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String seatNumber;
}
