package com.ticket.booking.controller;

import com.ticket.booking.dto.PaymentRequest;
import com.ticket.booking.dto.PaymentResponse;

import org.springframework.web.bind.annotation.*;

import java.util.UUID;


@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:4200")
public class PaymentController {


    @PostMapping("/process")
    public PaymentResponse processPayment(
            @RequestBody PaymentRequest request) {


        if (request.getCardHolderName() == null ||
            request.getCardHolderName().isBlank()) {

            return new PaymentResponse(
                    false,
                    "Card holder name is required",
                    null
            );
        }


        if (request.getCardNumber() == null ||
            request.getCardNumber().length() != 16) {

            return new PaymentResponse(
                    false,
                    "Invalid card number",
                    null
            );
        }


        if (request.getCvv() == null ||
            request.getCvv().length() != 3) {

            return new PaymentResponse(
                    false,
                    "Invalid CVV",
                    null
            );
        }


        String transactionId =
                "TXN-" +
                UUID.randomUUID()
                   .toString()
                   .substring(0, 8)
                   .toUpperCase();


        return new PaymentResponse(
                true,
                "Payment successful",
                transactionId
        );
    }
}