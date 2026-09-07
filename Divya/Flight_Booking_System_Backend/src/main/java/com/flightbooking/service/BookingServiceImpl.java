package com.flightbooking.service;

import com.flightbooking.dto.BookingRequest;
import com.flightbooking.dto.BookingResponse;
import com.flightbooking.entity.Booking;
import com.flightbooking.entity.Flight;
import com.flightbooking.entity.Passenger;
import com.flightbooking.entity.User;
import com.flightbooking.exception.BookingException;
import com.flightbooking.exception.ResourceNotFoundException;
import com.flightbooking.repository.BookingRepository;
import com.flightbooking.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final FlightService flightService;

    public BookingServiceImpl(BookingRepository bookingRepository,
                               UserRepository userRepository,
                               FlightService flightService) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.flightService = flightService;
    }

    @Override
    public BookingResponse createBooking(BookingRequest request, Long userId) {
        // Fetch user and flight
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Flight flight = flightService.getFlightById(request.getFlightId());

        // Check flight status
        if (flight.getStatus() != Flight.FlightStatus.SCHEDULED) {
            throw new BookingException("Flight is not available for booking. Status: " + flight.getStatus());
        }

        // Check seat availability
        int requiredSeats = request.getPassengers().size();
        if (flight.getAvailableSeats() < requiredSeats) {
            throw new BookingException(
                "Not enough seats available. Required: " + requiredSeats +
                ", Available: " + flight.getAvailableSeats()
            );
        }

        // Calculate total amount with 12% tax to match frontend
        BigDecimal baseAmount = flight.getPrice().multiply(BigDecimal.valueOf(requiredSeats));
        BigDecimal tax = baseAmount.multiply(BigDecimal.valueOf(0.12)).setScale(0, java.math.RoundingMode.HALF_UP);
        BigDecimal totalAmount = baseAmount.add(tax);

        // Create booking
        Booking booking = Booking.builder()
                .user(user)
                .flight(flight)
                .bookingDate(LocalDateTime.now())
                .status(Booking.BookingStatus.CONFIRMED)
                .totalAmount(totalAmount)
                .build();

        // Map passengers and allocate seat numbers if null
        java.util.concurrent.atomic.AtomicInteger seatCounter = new java.util.concurrent.atomic.AtomicInteger(1);
        List<Passenger> passengers = request.getPassengers().stream()
                .map(p -> Passenger.builder()
                        .firstName(p.getFirstName())
                        .lastName(p.getLastName())
                        .dateOfBirth(p.getDateOfBirth())
                        .seatNumber(p.getSeatNumber() != null ? p.getSeatNumber() : (seatCounter.getAndIncrement() + "A"))
                        .passportNumber(p.getPassportNumber())
                        .booking(booking)
                        .build())
                .collect(Collectors.toList());

        booking.setPassengers(passengers);
        Booking saved = bookingRepository.save(booking);

        // Deduct seats from flight
        flightService.updateAvailableSeats(flight.getFlightId(), -requiredSeats);

        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findByBookingIdAndUser_UserId(bookingId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));
        return toResponse(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getUserBookings(Long userId) {
        return bookingRepository.findByUser_UserId(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BookingResponse cancelBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findByBookingIdAndUser_UserId(bookingId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new BookingException("Booking is already cancelled");
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        Booking saved = bookingRepository.save(booking);

        // Restore seats to the flight
        int seatsToRestore = booking.getPassengers().size();
        flightService.updateAvailableSeats(booking.getFlight().getFlightId(), seatsToRestore);

        return toResponse(saved);
    }

    private BookingResponse toResponse(Booking booking) {
        return BookingResponse.builder()
                .bookingId(booking.getBookingId())
                .flightId(booking.getFlight().getFlightId())
                .flightNumber(booking.getFlight().getFlightNumber())
                .airline(booking.getFlight().getAirline())
                .origin(booking.getFlight().getOrigin())
                .destination(booking.getFlight().getDestination())
                .departureTime(booking.getFlight().getDepartureTime())
                .arrivalTime(booking.getFlight().getArrivalTime())
                .bookingDate(booking.getBookingDate())
                .status(booking.getStatus().name())
                .totalAmount(booking.getTotalAmount())
                .passengers(booking.getPassengers())
                .userId(booking.getUser().getUserId())
                .userEmail(booking.getUser().getEmail())
                .build();
    }
}
