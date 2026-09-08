package com.flight.booking.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PaymentResponseDTO {

    private Long paymentId;

    private Long bookingId;

    private Double amount;

    private String paymentMethod;

    private String paymentStatus;

    private String transactionId;

    private LocalDateTime paymentDate;
}