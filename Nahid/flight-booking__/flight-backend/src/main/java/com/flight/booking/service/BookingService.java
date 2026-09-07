package com.flight.booking.service;

import com.flight.booking.dto.request.BookingRequestDTO;
import com.flight.booking.dto.response.BookingResponseDTO;

import java.util.List;

public interface BookingService {

    BookingResponseDTO createBooking(String userEmail, BookingRequestDTO request);

    List<BookingResponseDTO> getUserBookings(String userEmail);

    BookingResponseDTO getBookingByReference(String userEmail, String reference);

    BookingResponseDTO cancelBooking(String userEmail, String reference);
}
