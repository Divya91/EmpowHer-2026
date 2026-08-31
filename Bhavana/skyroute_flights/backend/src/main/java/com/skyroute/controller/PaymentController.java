package com.skyroute.controller;

import com.skyroute.dto.booking.BookingResponseDto;
import com.skyroute.dto.payment.PaymentInitiateRequest;
import com.skyroute.dto.payment.PaymentVerifyRequest;
import com.skyroute.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Payment Initiation, Gateway Verification, and Webhooks")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/initiate")
    @Operation(summary = "Initiate payment order with selected gateway (Card, UPI, NetBanking)")
    public ResponseEntity<Map<String, Object>> initiate(
            @Valid @RequestBody PaymentInitiateRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String email = userDetails != null ? userDetails.getUsername() : "customer";
        return ResponseEntity.ok(paymentService.initiatePayment(request, email));
    }

    @PostMapping("/verify")
    @Operation(summary = "Verify transaction signature/status and confirm ticket reservation")
    public ResponseEntity<BookingResponseDto> verify(
            @Valid @RequestBody PaymentVerifyRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String email = userDetails != null ? userDetails.getUsername() : "customer";
        return ResponseEntity.ok(paymentService.verifyPayment(request, email));
    }
}
