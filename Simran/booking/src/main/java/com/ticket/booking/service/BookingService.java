package com.ticket.booking.service;

import com.ticket.booking.dto.BookingRequest;
import com.ticket.booking.entity.*;
import com.ticket.booking.repository.BookingRepository;
import com.ticket.booking.repository.FlightRepository;
import com.ticket.booking.repository.PassengerRepository;
import com.ticket.booking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final FlightRepository flightRepository;
    private final PassengerRepository passengerRepository;

    @Transactional
    public Booking createBooking(BookingRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Flight flight = flightRepository.findById(request.getFlightId())
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        Passenger passenger = passengerRepository.findById(request.getPassengerId())
                .orElseThrow(() -> new RuntimeException("Passenger not found"));

        int seats = request.getNumberOfSeats();

        if (seats <= 0) {
            throw new RuntimeException(
                    "Number of seats must be greater than zero");
        }

        if (flight.getAvailableSeats() < seats) {
            throw new RuntimeException(
                    "Not enough seats available");
        }

        double totalAmount = flight.getPrice() * seats;

        // Reduce available seats
        flight.setAvailableSeats(
                flight.getAvailableSeats() - seats);

        flightRepository.save(flight);

        // Generate seat numbers
        String seatNumbers = generateSeatNumbers(seats);

        Booking booking = Booking.builder()
                .bookingReference(generateBookingReference())
                .user(user)
                .flight(flight)
                .passenger(passenger)
                .numberOfSeats(seats)
                .seatNumbers(seatNumbers)
                .totalAmount(totalAmount)
                .bookingDate(LocalDateTime.now())
                .status(BookingStatus.CONFIRMED)
                .build();

        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(Integer id) {

        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    private String generateSeatNumbers(int numberOfSeats) {

        StringBuilder seats = new StringBuilder();

        int row = 10;

        String[] seatLetters = {
                "A", "B", "C", "D", "E", "F"
        };

        for (int i = 0; i < numberOfSeats; i++) {

            if (i > 0) {
                seats.append(", ");
            }

            seats.append(row)
                    .append(seatLetters[i % seatLetters.length]);
        }

        return seats.toString();
    }

    public List<Booking> getUserBookings(Integer userId) {
        return bookingRepository.findByUserId(userId);
    }

    @Transactional
    public Booking cancelBooking(Integer id) {

        Booking booking = getBookingById(id);

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking already cancelled");
        }

        Flight flight = booking.getFlight();

        flight.setAvailableSeats(
                flight.getAvailableSeats()
                        + booking.getNumberOfSeats());

        flightRepository.save(flight);

        booking.setStatus(BookingStatus.CANCELLED);

        return bookingRepository.save(booking);
    }

    private String generateBookingReference() {
        return "BK-" + UUID.randomUUID()
                .toString()
                .substring(0, 8)
                .toUpperCase();
    }
}