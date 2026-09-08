package com.example.flight.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SeatLockRequestDTO {

    @NotNull(message = "Segment ID is required")
    private Long segmentId;

    @NotNull(message = "Passenger ID is required")
    private Long passengerId;
}