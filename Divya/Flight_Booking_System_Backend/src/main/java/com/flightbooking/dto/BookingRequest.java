package com.flightbooking.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class BookingRequest {

    @NotNull(message = "Flight ID is required")
    private Long flightId;

    @NotNull(message = "At least one passenger is required")
    @Valid
    private List<PassengerInfo> passengers;

    @Data
    public static class PassengerInfo {

        @NotBlank(message = "First name is required")
        private String firstName;

        @NotBlank(message = "Last name is required")
        private String lastName;

        @NotNull(message = "Date of birth is required")
        private LocalDate dateOfBirth;

        private String seatNumber;

        private String passportNumber;
    }
}