package com.flightbooking.service;

import com.flightbooking.dto.BookingRequest;
import com.flightbooking.dto.BookingResponse;

import java.util.List;

public interface BookingService {

    BookingResponse createBooking(BookingRequest request, Long userId);

    BookingResponse getBookingById(Long bookingId, Long userId);

    List<BookingResponse> getUserBookings(Long userId);

    BookingResponse cancelBooking(Long bookingId, Long userId);
}
