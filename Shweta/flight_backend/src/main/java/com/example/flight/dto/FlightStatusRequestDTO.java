package com.example.flight.dto;

import com.example.flight.entity.FlightStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FlightStatusRequestDTO {

    @NotNull
    private FlightStatus status;
}