package com.example.flight.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class BookingSegmentRequestDTO {

    @NotNull(message = "Flight ID is required")
    private Long flightId;

    @NotNull(message = "Segment order is required")
    @Positive(message = "Segment order must be positive")
    private Integer segmentOrder;
}