package com.flight.booking.mapper;

import com.flight.booking.dto.request.BookingRequestDTO;
import com.flight.booking.dto.response.BookingResponseDTO;
import com.flight.booking.entity.Booking;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {

    // RequestDTO -> Entity
    public Booking toEntity(BookingRequestDTO dto) {

        Booking booking = new Booking();

        booking.setUserId(dto.getUserId());
        booking.setFlightId(dto.getFlightId());
        booking.setTotalAmount(dto.getTotalAmount());

        return booking;
    }

    // Entity -> ResponseDTO
    public BookingResponseDTO toResponseDTO(Booking booking) {

        BookingResponseDTO response = new BookingResponseDTO();

        response.setBookingId(booking.getBookingId());
        response.setUserId(booking.getUserId());
        response.setFlightId(booking.getFlightId());
        response.setBookingCode(booking.getBookingCode());
        response.setStatus(booking.getStatus());
        response.setPaymentStatus(booking.getPaymentStatus());
        response.setTotalAmount(booking.getTotalAmount());
        response.setBookingTs(booking.getBookingTs());

        return response;
    }

    // Update existing entity
    public void updateEntity(
            BookingRequestDTO dto,
            Booking booking) {

        booking.setUserId(dto.getUserId());
        booking.setFlightId(dto.getFlightId());
        booking.setTotalAmount(dto.getTotalAmount());
    }
}