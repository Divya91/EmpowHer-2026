package com.flight.booking.dto.request;

import lombok.Data;

@Data
public class PaymentRequestDTO {

    private Double amount;
    private String paymentMethod;
    private String paymentStatus;
    private String transactionId;
}