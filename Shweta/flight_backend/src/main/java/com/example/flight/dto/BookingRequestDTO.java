package com.example.flight.dto;

import java.util.List;

import com.example.flight.entity.CabinClass;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingRequestDTO {

    @NotEmpty(message = "At least one flight is required")
    private List<Long> flightIds;

    @NotNull(message = "Cabin class is required")
    private CabinClass cabinClass;
}