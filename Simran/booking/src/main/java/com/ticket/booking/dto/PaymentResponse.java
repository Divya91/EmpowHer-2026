package com.ticket.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentResponse {

    private boolean success;

    private String message;

    private String transactionId;
}