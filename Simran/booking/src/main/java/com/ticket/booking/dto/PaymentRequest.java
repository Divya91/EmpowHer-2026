package com.ticket.booking.dto;

import lombok.Data;

@Data
public class PaymentRequest {

    private String cardHolderName;

    private String cardNumber;

    private String expiryMonth;

    private String expiryYear;

    private String cvv;

    private Double amount;
}