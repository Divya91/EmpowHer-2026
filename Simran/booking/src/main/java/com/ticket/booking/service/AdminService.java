package com.ticket.booking.service;

import com.ticket.booking.entity.BookingStatus;
import com.ticket.booking.repository.BookingRepository;
import com.ticket.booking.repository.FlightRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final FlightRepository flightRepository;
    private final BookingRepository bookingRepository;

    public Map<String, Long> getDashboardStats() {

        long totalFlights = flightRepository.count();
        long totalBookings = bookingRepository.count();

        long confirmedBookings =
                bookingRepository.countByStatus(
                        BookingStatus.CONFIRMED
                );

        long cancelledBookings =
                bookingRepository.countByStatus(
                        BookingStatus.CANCELLED
                );

        return Map.of(
                "totalFlights", totalFlights,
                "totalBookings", totalBookings,
                "confirmedBookings", confirmedBookings,
                "cancelledBookings", cancelledBookings
        );
    }
}