package com.example.flight.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PaymentResponseDTO {

    private Long paymentId;

    private Long bookingId;

    private String paymentMethod;

    private BigDecimal amount;

    private String status;

    private String transactionRef;

    private LocalDateTime paidAt;
}