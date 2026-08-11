package com.example.flight.controller;



import com.example.flight.dto.BookingRequestDTO;
import com.example.flight.dto.BookingResponseDTO;
import com.example.flight.service.BookingService;
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
public class BookingController {

    private final BookingService bookingService;

    // Get all bookings
    @GetMapping
    public ResponseEntity<List<BookingResponseDTO>>
    getAllBookings() {

        return ResponseEntity.ok(
                bookingService.getAllBookings()
        );
    }

    // Get booking by ID
    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponseDTO>
    getBookingById(
            @PathVariable Long bookingId) {

        return ResponseEntity.ok(
                bookingService.getBookingById(bookingId)
        );
    }

    // Get booking by booking code
    @GetMapping("/code/{bookingCode}")
    public ResponseEntity<BookingResponseDTO>
    getBookingByCode(
            @PathVariable String bookingCode) {

        return ResponseEntity.ok(
                bookingService.getBookingByCode(bookingCode)
        );
    }

    // Get bookings by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingResponseDTO>>
    getBookingsByUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                bookingService.getBookingsByUser(userId)
        );
    }

    // Get bookings by flight
    @GetMapping("/flight/{flightId}")
    public ResponseEntity<List<BookingResponseDTO>>
    getBookingsByFlight(
            @PathVariable Long flightId) {

        return ResponseEntity.ok(
                bookingService.getBookingsByFlight(flightId)
        );
    }

    // Create booking
   @PostMapping
public ResponseEntity<BookingResponseDTO>
createBooking(
        @Valid @RequestBody BookingRequestDTO dto,
        Authentication authentication) {

    String email = authentication.getName();

    return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(
                    bookingService.createBooking(
                            dto,
                            email
                    )
            );
}

    

    
}