package com.example.flight.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaymentRequestDTO {

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    @NotBlank(message = "Payment method is required")
    @Size(max = 50, message = "Payment method cannot exceed 50 characters")
    private String paymentMethod;

    @NotNull(message = "Amount is required")
    @DecimalMin(
            value = "0.0",
            message = "Amount cannot be negative"
    )
    private BigDecimal amount;

    @NotBlank(message = "Payment status is required")
    @Size(max = 50, message = "Status cannot exceed 50 characters")
    private String status;

    @Size(
            max = 100,
            message = "Transaction reference cannot exceed 100 characters"
    )
    private String transactionRef;
}