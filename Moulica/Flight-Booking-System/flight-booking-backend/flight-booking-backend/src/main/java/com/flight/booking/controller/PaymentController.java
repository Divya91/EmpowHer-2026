package com.flight.booking.controller;

import com.flight.booking.entity.Payment;
import com.flight.booking.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Payment> makePayment(
            @RequestBody Payment payment) {

        Payment savedPayment = paymentService.savePayment(payment);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedPayment);
    }
}