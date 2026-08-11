package com.example.flight.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class PassengerResponseDTO {

    private Long passengerId;

    private Long bookingId;

    private String firstName;

    private String lastName;

    private LocalDate dateOfBirth;

    private String seatNumber;
}