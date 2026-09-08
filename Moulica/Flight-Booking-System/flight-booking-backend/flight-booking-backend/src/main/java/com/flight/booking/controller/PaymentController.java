package com.flight.booking.controller;



import com.flight.booking.dto.request.PaymentRequestDTO;
import com.flight.booking.dto.response.PaymentResponseDTO;
import com.flight.booking.service.PaymentService;

import jakarta.validation.Valid;

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
    public ResponseEntity<PaymentResponseDTO> createPayment(
            @Valid @RequestBody PaymentRequestDTO dto) {

        PaymentResponseDTO response =
                paymentService.createPayment(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}