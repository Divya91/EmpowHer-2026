package com.example.flight.service;




import com.example.flight.dto.BookingRequestDTO;
import com.example.flight.dto.BookingResponseDTO;
import com.example.flight.entity.Booking;
import com.example.flight.entity.Flight;
import com.example.flight.entity.User;
import com.example.flight.repository.BookingRepository;
import com.example.flight.repository.FlightRepository;
import com.example.flight.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final FlightRepository flightRepository;
    private final ModelMapper modelMapper;


    // Get All Bookings
    public List<BookingResponseDTO> getAllBookings() {

        return bookingRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // Get Booking By ID
    public BookingResponseDTO getBookingById(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking not found with ID: " + bookingId
                        ));

        return convertToResponse(booking);
    }


    // Get Booking By Code
    public BookingResponseDTO getBookingByCode(String bookingCode) {

        Booking booking =
                bookingRepository.findByBookingCode(bookingCode)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Booking not found with code: "
                                                + bookingCode
                                ));

        return convertToResponse(booking);
    }


    // Get Bookings By User
    public List<BookingResponseDTO> getBookingsByUser(Long userId) {

        if (!userRepository.existsById(userId)) {
            throw new RuntimeException(
                    "User not found with ID: " + userId
            );
        }

        return bookingRepository.findByUserUserId(userId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // Get Bookings By Flight
    public List<BookingResponseDTO> getBookingsByFlight(Long flightId) {

        if (!flightRepository.existsById(flightId)) {
            throw new RuntimeException(
                    "Flight not found with ID: " + flightId
            );
        }

        return bookingRepository.findByFlightFlightId(flightId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // Create Booking
    public BookingResponseDTO createBooking(
            BookingRequestDTO dto) {

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with ID: "
                                        + dto.getUserId()
                        ));


        Flight flight = flightRepository.findById(dto.getFlightId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Flight not found with ID: "
                                        + dto.getFlightId()
                        ));


        // DTO -> Entity
        Booking booking =
                modelMapper.map(dto, Booking.class);


        // Set relationships
        booking.setUser(user);
        booking.setFlight(flight);


        // Generate booking code
        if (dto.getBookingCode() == null ||
                dto.getBookingCode().isBlank()) {

            booking.setBookingCode(
                    generateBookingCode()
            );
        }


        // Default status
        if (dto.getStatus() == null ||
                dto.getStatus().isBlank()) {

            booking.setStatus("PENDING");
        }


        // Default payment status
        if (dto.getPaymentStatus() == null ||
                dto.getPaymentStatus().isBlank()) {

            booking.setPaymentStatus("PENDING");
        }


        booking.setBookingTs(LocalDateTime.now());


        Booking savedBooking =
                bookingRepository.save(booking);


        return convertToResponse(savedBooking);
    }


    // Update Booking
    public BookingResponseDTO updateBooking(
            Long bookingId,
            BookingRequestDTO dto) {

        Booking booking =
                bookingRepository.findById(bookingId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Booking not found with ID: "
                                                + bookingId
                                ));


        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with ID: "
                                        + dto.getUserId()
                        ));


        Flight flight = flightRepository.findById(dto.getFlightId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Flight not found with ID: "
                                        + dto.getFlightId()
                        ));


        // DTO -> existing Entity
        modelMapper.map(dto, booking);


        booking.setUser(user);
        booking.setFlight(flight);


        Booking updatedBooking =
                bookingRepository.save(booking);


        return convertToResponse(updatedBooking);
    }


    // Delete Booking
    public void deleteBooking(Long bookingId) {

        Booking booking =
                bookingRepository.findById(bookingId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Booking not found with ID: "
                                                + bookingId
                                ));

        bookingRepository.delete(booking);
    }


    // Entity -> Response DTO
    private BookingResponseDTO convertToResponse(
            Booking booking) {

        BookingResponseDTO response =
                new BookingResponseDTO();

        response.setBookingId(
                booking.getBookingId()
        );

        response.setUserId(
                booking.getUser().getUserId()
        );

        response.setFlightId(
                booking.getFlight().getFlightId()
        );

        response.setBookingCode(
                booking.getBookingCode()
        );

        response.setStatus(
                booking.getStatus()
        );

        response.setPaymentStatus(
                booking.getPaymentStatus()
        );

        response.setTotalAmount(
                booking.getTotalAmount()
        );

        response.setBookingTs(
                booking.getBookingTs()
        );

        return response;
    }


    // Generate unique booking code
    private String generateBookingCode() {

        String code;

        do {
            code = UUID.randomUUID()
                    .toString()
                    .replace("-", "")
                    .substring(0, 6)
                    .toUpperCase();

        } while (
                bookingRepository.existsByBookingCode(code)
        );

        return code;
    }
}