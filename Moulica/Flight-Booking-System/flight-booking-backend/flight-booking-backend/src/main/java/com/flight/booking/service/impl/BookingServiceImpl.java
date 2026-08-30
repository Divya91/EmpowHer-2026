package com.flight.booking.service.impl;

import com.flight.booking.dto.request.BookingRequestDTO;
import com.flight.booking.dto.response.BookingResponseDTO;
import com.flight.booking.entity.Booking;
import com.flight.booking.mapper.BookingMapper;
import com.flight.booking.repository.BookingRepository;
import com.flight.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final BookingMapper bookingMapper;

    @Override
    public BookingResponseDTO createBooking(BookingRequestDTO dto) {

        Booking booking = bookingMapper.toEntity(dto);

        // Generate booking code automatically
        String bookingCode;

        do {
            bookingCode = UUID.randomUUID()
                    .toString()
                    .replace("-", "")
                    .substring(0, 6)
                    .toUpperCase();

        } while (bookingRepository.existsByBookingCode(bookingCode));

        booking.setBookingCode(bookingCode);

        // Set default booking values
        booking.setStatus("PENDING");
        booking.setPaymentStatus("PENDING");
        booking.setBookingTs(LocalDateTime.now());

        Booking savedBooking = bookingRepository.save(booking);

        return bookingMapper.toResponseDTO(savedBooking);
    }

    @Override
    public List<BookingResponseDTO> getAllBookings() {

        return bookingRepository.findAll()
                .stream()
                .map(bookingMapper::toResponseDTO)
                .toList();
    }

    @Override
    public BookingResponseDTO getBookingById(Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        return bookingMapper.toResponseDTO(booking);
    }

    @Override
    public List<BookingResponseDTO> getBookingsByUserId(Long userId) {

        return bookingRepository.findByUserId(userId)
                .stream()
                .map(bookingMapper::toResponseDTO)
                .toList();
    }

    @Override
    public BookingResponseDTO updateBooking(
            Long id,
            BookingRequestDTO dto) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        bookingMapper.updateEntity(dto, booking);

        Booking updatedBooking = bookingRepository.save(booking);

        return bookingMapper.toResponseDTO(updatedBooking);
    }

    @Override
    public void deleteBooking(Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        bookingRepository.delete(booking);
    }
}