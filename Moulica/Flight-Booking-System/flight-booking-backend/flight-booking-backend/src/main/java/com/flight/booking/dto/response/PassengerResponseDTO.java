package com.flight.booking.dto;

import lombok.Data;

@Data
public class PassengerResponseDTO {

    private Long passengerId;
    private String firstName;
    private String lastName;
    private Integer age;
    private String gender;
    private String email;
    private String phoneNumber;
    private String nationality;
    private String passportNumber;
}