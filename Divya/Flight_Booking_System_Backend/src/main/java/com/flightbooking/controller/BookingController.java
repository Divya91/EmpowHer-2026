package com.flightbooking.controller;

import com.flightbooking.dto.BookingRequest;
import com.flightbooking.dto.BookingResponse;
import com.flightbooking.entity.User;
import com.flightbooking.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:4200")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    /**
     * Create a new booking for the authenticated user
     * POST /api/bookings
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookingResponse createBooking(
            @Valid @RequestBody BookingRequest request,
            @RequestParam Long userId) {
        return bookingService.createBooking(request, userId);
    }

    /**
     * Get all bookings for the authenticated user
     * GET /api/bookings/my
     */
    @GetMapping("/my")
    public List<BookingResponse> getMyBookings(@RequestParam Long userId) {
        return bookingService.getUserBookings(userId);
    }

    /**
     * Get a specific booking (only if it belongs to the authenticated user)
     * GET /api/bookings/{id}
     */
    @GetMapping("/{id}")
    public BookingResponse getBookingById(
            @PathVariable Long id,
            @RequestParam Long userId) {
        return bookingService.getBookingById(id, userId);
    }

    /**
     * Cancel a booking (only if it belongs to the authenticated user)
     * DELETE /api/bookings/{id}/cancel
     */
    @DeleteMapping("/{id}/cancel")
    public BookingResponse cancelBooking(
            @PathVariable Long id,
            @RequestParam Long userId) {
        return bookingService.cancelBooking(id, userId);
    }
}
