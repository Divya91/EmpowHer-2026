package com.example.flight.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BookingCancellationRequestDTO {

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    @Size(
            max = 500,
            message = "Cancellation reason cannot exceed 500 characters"
    )
    private String cancellationReason;

    @DecimalMin(
            value = "0.0",
            message = "Cancellation charges cannot be negative"
    )
    private BigDecimal cancellationCharges;

    @DecimalMin(
            value = "0.0",
            message = "Refund amount cannot be negative"
    )
    private BigDecimal refundAmount;
}