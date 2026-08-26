package com.flyora.api.service;

import com.flyora.api.entity.Booking;
import com.flyora.api.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public Booking saveBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBooking(Long id) {
        return bookingRepository.findById(id).orElse(null);
    }

    public Booking cancelBooking(Long id) {

        Booking booking = bookingRepository.findById(id).orElse(null);

        if (booking != null) {
            booking.setBookingStatus("CANCELLED");
            return bookingRepository.save(booking);
        }

        return null;
    }
}