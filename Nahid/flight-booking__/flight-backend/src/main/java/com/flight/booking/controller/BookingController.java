package com.flight.booking.controller;

import com.flight.booking.dto.request.BookingRequestDTO;
import com.flight.booking.dto.response.BookingResponseDTO;
import com.flight.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(
            Authentication authentication,
            @Valid @RequestBody BookingRequestDTO request
    ) {
        String email = authentication.getName();
        BookingResponseDTO response = bookingService.createBooking(email, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public List<BookingResponseDTO> getMyBookings(Authentication authentication) {
        return bookingService.getUserBookings(authentication.getName());
    }

    @GetMapping("/{reference}")
    public BookingResponseDTO getBooking(
            Authentication authentication,
            @PathVariable String reference
    ) {
        return bookingService.getBookingByReference(authentication.getName(), reference);
    }

    @DeleteMapping("/{reference}")
    public ResponseEntity<BookingResponseDTO> cancelBooking(
            Authentication authentication,
            @PathVariable String reference
    ) {
        BookingResponseDTO response = bookingService.cancelBooking(authentication.getName(), reference);
        return ResponseEntity.ok(response);
    }
}
