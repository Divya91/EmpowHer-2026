package com.ticket.booking.controller;

import com.ticket.booking.dto.BookingRequest;
import com.ticket.booking.entity.Booking;
import com.ticket.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public Booking createBooking(
            @RequestBody BookingRequest request) {

        return bookingService.createBooking(request);
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/{id}")
    public Booking getBooking(
            @PathVariable Integer id) {

        return bookingService.getBookingById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Booking> getUserBookings(
            @PathVariable Integer userId) {

        return bookingService.getUserBookings(userId);
    }

    @PutMapping("/{id}/cancel")
    public Booking cancelBooking(
            @PathVariable Integer id) {

        return bookingService.cancelBooking(id);
    }
}