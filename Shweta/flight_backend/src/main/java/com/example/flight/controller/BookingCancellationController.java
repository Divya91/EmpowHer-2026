package com.example.flight.controller;

import com.example.flight.dto.BookingCancellationRequestDTO;
import com.example.flight.dto.BookingCancellationResponseDTO;
import com.example.flight.service.BookingCancellationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cancellations")
@RequiredArgsConstructor
public class BookingCancellationController {

    private final BookingCancellationService cancellationService;

    // Get all cancellations
    @GetMapping
    public ResponseEntity<List<BookingCancellationResponseDTO>>
    getAllCancellations() {

        return ResponseEntity.ok(
                cancellationService.getAllCancellations()
        );
    }

    // Get cancellation by ID
    @GetMapping("/{cancellationId}")
    public ResponseEntity<BookingCancellationResponseDTO>
    getCancellationById(
            @PathVariable Long cancellationId) {

        return ResponseEntity.ok(
                cancellationService.getCancellationById(
                        cancellationId
                )
        );
    }

    // Get cancellations by booking
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<BookingCancellationResponseDTO>>
    getCancellationsByBooking(
            @PathVariable Long bookingId) {

        return ResponseEntity.ok(
                cancellationService.getCancellationsByBooking(
                        bookingId
                )
        );
    }

    // Create cancellation
    @PostMapping
    public ResponseEntity<BookingCancellationResponseDTO>
    createCancellation(
            @Valid @RequestBody
            BookingCancellationRequestDTO dto) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        cancellationService.createCancellation(dto)
                );
    }

    // Update cancellation
    @PutMapping("/{cancellationId}")
    public ResponseEntity<BookingCancellationResponseDTO>
    updateCancellation(
            @PathVariable Long cancellationId,
            @Valid @RequestBody
            BookingCancellationRequestDTO dto) {

        return ResponseEntity.ok(
                cancellationService.updateCancellation(
                        cancellationId,
                        dto
                )
        );
    }

    // Delete cancellation
    @DeleteMapping("/{cancellationId}")
    public ResponseEntity<String> deleteCancellation(
            @PathVariable Long cancellationId) {

        cancellationService.deleteCancellation(
                cancellationId
        );

        return ResponseEntity.ok(
                "Booking cancellation deleted successfully"
        );
    }
}