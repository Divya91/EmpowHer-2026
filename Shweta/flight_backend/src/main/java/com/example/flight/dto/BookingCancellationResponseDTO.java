package com.example.flight.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class BookingCancellationResponseDTO {

    private Long cancellationId;

    private Long bookingId;

    private String cancellationReason;

    private BigDecimal cancellationCharges;

    private BigDecimal refundAmount;

    private LocalDateTime processedAt;
}