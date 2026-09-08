package com.flight.booking.service;

import com.flight.booking.dto.request.BookingRequestDTO;
import com.flight.booking.dto.response.BookingResponseDTO;

import java.util.List;

public interface BookingService {

    BookingResponseDTO createBooking(BookingRequestDTO dto);

    List<BookingResponseDTO> getAllBookings();

    BookingResponseDTO getBookingById(Long id);

    List<BookingResponseDTO> getBookingsByUserId(Long userId);

    BookingResponseDTO updateBooking(Long id, BookingRequestDTO dto);

    void deleteBooking(Long id);
}