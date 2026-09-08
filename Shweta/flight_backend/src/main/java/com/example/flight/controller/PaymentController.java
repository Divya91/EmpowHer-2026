package com.example.flight.controller;

import com.example.flight.dto.PaymentRequestDTO;
import com.example.flight.dto.PaymentResponseDTO;
import com.example.flight.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // Get all payments
    @GetMapping
    public ResponseEntity<List<PaymentResponseDTO>>
    getAllPayments() {

        return ResponseEntity.ok(
                paymentService.getAllPayments()
        );
    }

    // Get payment by ID
    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentResponseDTO>
    getPaymentById(
            @PathVariable Long paymentId) {

        return ResponseEntity.ok(
                paymentService.getPaymentById(paymentId)
        );
    }

    // Get payments by booking
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<PaymentResponseDTO>>
    getPaymentsByBooking(
            @PathVariable Long bookingId) {

        return ResponseEntity.ok(
                paymentService.getPaymentsByBooking(
                        bookingId
                )
        );
    }

    // Get payment by transaction reference
    @GetMapping("/transaction/{transactionRef}")
    public ResponseEntity<PaymentResponseDTO>
    getPaymentByTransactionRef(
            @PathVariable String transactionRef) {

        return ResponseEntity.ok(
                paymentService.getPaymentByTransactionRef(
                        transactionRef
                )
        );
    }

    // Add payment
    @PostMapping
    public ResponseEntity<PaymentResponseDTO>
    addPayment(
            @Valid @RequestBody PaymentRequestDTO dto) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        paymentService.addPayment(dto)
                );
    }

    // Update payment
    @PutMapping("/{paymentId}")
    public ResponseEntity<PaymentResponseDTO>
    updatePayment(
            @PathVariable Long paymentId,
            @Valid @RequestBody PaymentRequestDTO dto) {

        return ResponseEntity.ok(
                paymentService.updatePayment(
                        paymentId,
                        dto
                )
        );
    }

    // Delete payment
    @DeleteMapping("/{paymentId}")
    public ResponseEntity<String>
    deletePayment(
            @PathVariable Long paymentId) {

        paymentService.deletePayment(paymentId);

        return ResponseEntity.ok(
                "Payment deleted successfully"
        );
    }
}