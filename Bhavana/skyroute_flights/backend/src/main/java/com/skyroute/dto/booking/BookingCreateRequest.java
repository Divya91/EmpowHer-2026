package com.skyroute.dto.booking;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingCreateRequest {
    @NotNull(message = "Flight schedule ID is required")
    private Long scheduleId;

    @NotBlank(message = "Cabin class is required")
    private String cabinClass;

    @NotEmpty(message = "At least one passenger is required")
    private List<PassengerDto> passengers;

    @NotBlank(message = "Contact email is required")
    @Email(message = "Valid contact email is required")
    private String contactEmail;

    @NotBlank(message = "Contact phone is required")
    private String contactPhone;

    private String specialRequests;
}
