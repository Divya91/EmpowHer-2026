package com.flight.booking.dto.response;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PassengerResponseDTO {

    private Long passengerId;

    private String firstName;

    private String lastName;

    private LocalDate dateOfBirth;

    private String seatNumber;

    private Integer age;

    private String gender;

    private String nationality;

    private String passportNumber;

    private String phoneNumber;

    private String email;
}