package com.example.flight.dto;



import lombok.Data;

import java.time.LocalDate;

@Data
public class PassengerResponseDTO {

    private Long passengerId;

    private Long bookingId;

    private String firstName;

    private String lastName;

    private LocalDate dateOfBirth;

    private String seatNumber;
}