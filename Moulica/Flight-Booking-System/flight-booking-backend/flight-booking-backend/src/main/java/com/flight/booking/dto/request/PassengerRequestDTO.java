package com.flight.booking.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PassengerRequestDTO {

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