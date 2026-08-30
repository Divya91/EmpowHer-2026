package com.example.flight.service;
// this check the user is authorized to access the booking or not
//Verifies booking ownership
import org.springframework.stereotype.Service;

import com.example.flight.entity.Booking;
import com.example.flight.repository.BookingRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingAccessService {

    private final BookingRepository bookingRepository;

    public Booking getUserBooking(
            Long bookingId,
            String email) {

        Booking booking = bookingRepository
                .findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking not found with ID: "
                                        + bookingId
                        )
                );

        if (!booking.getUser()
                .getEmail()
                .equalsIgnoreCase(email)) {

            throw new RuntimeException(
                    "You are not authorized to access this booking"
            );
        }

        return booking;
    }
}