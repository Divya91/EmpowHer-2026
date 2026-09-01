package com.flight.booking.service.impl;

import com.flight.booking.dto.request.BookingRequestDTO;
import com.flight.booking.dto.response.BookingResponseDTO;
import com.flight.booking.entity.*;
import com.flight.booking.repository.BookingRepository;
import com.flight.booking.repository.FlightRepository;
import com.flight.booking.repository.UserRepository;
import com.flight.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final FlightRepository flightRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public BookingResponseDTO createBooking(String userEmail, BookingRequestDTO request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Flight flight = flightRepository.findById(request.getFlightId())
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        if (flight.getAvailableSeats() < request.getPassengers()) {
            throw new RuntimeException("Not enough seats available");
        }

        validatePayment(request);

        String paymentRef = buildPaymentReference(request);
        BigDecimal total = flight.getBasePrice()
                .multiply(BigDecimal.valueOf(request.getPassengers()));

        Booking booking = Booking.builder()
                .bookingReference(generateReference())
                .user(user)
                .flight(flight)
                .passengers(request.getPassengers())
                .totalAmount(total)
                .paymentMethod(request.getPaymentMethod())
                .paymentReference(paymentRef)
                .status(BookingStatus.CONFIRMED)
                .bookedAt(LocalDateTime.now())
                .build();

        flight.setAvailableSeats((short) (flight.getAvailableSeats() - request.getPassengers()));
        flightRepository.save(flight);

        Booking saved = bookingRepository.save(booking);
        BookingResponseDTO response = toResponse(saved);
        response.setMessage("Booking confirmed successfully!");
        return response;
    }

    @Override
    public List<BookingResponseDTO> getUserBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return bookingRepository.findByUserOrderByBookedAtDesc(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public BookingResponseDTO getBookingByReference(String userEmail, String reference) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = bookingRepository.findByBookingReference(reference)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Booking not found");
        }

        return toResponse(booking);
    }

    @Override
    @Transactional
    public BookingResponseDTO cancelBooking(String userEmail, String reference) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = bookingRepository.findByBookingReference(reference)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Booking not found");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);

        Flight flight = booking.getFlight();
        flight.setAvailableSeats((short) (flight.getAvailableSeats() + booking.getPassengers()));
        flightRepository.save(flight);

        Booking saved = bookingRepository.save(booking);
        BookingResponseDTO response = toResponse(saved);
        response.setMessage("Booking cancelled. Refund will be processed in 5-7 business days.");
        return response;
    }

    private void validatePayment(BookingRequestDTO request) {
        if (request.getPaymentMethod() == PaymentMethod.CARD) {
            if (isBlank(request.getCardNumber()) || isBlank(request.getCardHolder())
                    || isBlank(request.getExpiryDate()) || isBlank(request.getCvv())) {
                throw new RuntimeException("All card details are required");
            }
            String digits = request.getCardNumber().replaceAll("\\s", "");
            if (digits.length() < 13 || digits.length() > 19) {
                throw new RuntimeException("Invalid card number");
            }
        } else if (request.getPaymentMethod() == PaymentMethod.UPI) {
            if (isBlank(request.getUpiId()) || !request.getUpiId().contains("@")) {
                throw new RuntimeException("Valid UPI ID is required");
            }
        }
    }

    private String buildPaymentReference(BookingRequestDTO request) {
        if (request.getPaymentMethod() == PaymentMethod.CARD) {
            String digits = request.getCardNumber().replaceAll("\\s", "");
            return "**** **** **** " + digits.substring(digits.length() - 4);
        }
        String upi = request.getUpiId();
        int atIndex = upi.indexOf('@');
        if (atIndex <= 2) {
            return upi;
        }
        return upi.substring(0, 2) + "****" + upi.substring(atIndex);
    }

    private String generateReference() {
        return "SS-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private BookingResponseDTO toResponse(Booking booking) {
        Flight flight = booking.getFlight();
        return BookingResponseDTO.builder()
                .bookingId(booking.getBookingId())
                .bookingReference(booking.getBookingReference())
                .flightId(flight.getFlightId())
                .airlineName(flight.getAirline().getName())
                .airlineCode(flight.getAirline().getAirlineCode())
                .fromAirport(flight.getFromAirport().getAirportCode())
                .toAirport(flight.getToAirport().getAirportCode())
                .departureTime(flight.getDepartureTime())
                .arrivalTime(flight.getArrivalTime())
                .passengers(booking.getPassengers())
                .totalAmount(booking.getTotalAmount())
                .paymentMethod(booking.getPaymentMethod())
                .paymentReference(booking.getPaymentReference())
                .status(booking.getStatus())
                .bookedAt(booking.getBookedAt())
                .build();
    }
}
