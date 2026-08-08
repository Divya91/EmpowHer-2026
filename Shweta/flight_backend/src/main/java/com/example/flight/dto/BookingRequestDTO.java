package com.example.flight.dto;


import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BookingRequestDTO {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Flight ID is required")
    private Long flightId;

    @Size(max = 6, message = "Booking code cannot exceed 6 characters")
    private String bookingCode;

    private String status;

    private String paymentStatus;

    @NotNull(message = "Total amount is required")
    @DecimalMin(
            value = "0.0",
            message = "Total amount cannot be negative"
    )
    private BigDecimal totalAmount;
}