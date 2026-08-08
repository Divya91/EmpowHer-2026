package com.example.flight.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PassengerRequestDTO {

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    @NotBlank(message = "First name is required")
    @Size(max = 100, message = "First name cannot exceed 100 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 100, message = "Last name cannot exceed 100 characters")
    private String lastName;

    private LocalDate dateOfBirth;

    @Size(max = 5, message = "Seat number cannot exceed 5 characters")
    private String seatNumber;
}