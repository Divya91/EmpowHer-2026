package com.flight.booking.dto.request;

import lombok.Data;

@Data
public class PaymentRequestDTO {

    private Long bookingId;

    private Double amount;

    private String paymentMethod;

    private String paymentStatus;

    private String transactionId;
}