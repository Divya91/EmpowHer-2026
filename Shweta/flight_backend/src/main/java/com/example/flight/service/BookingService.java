package com.example.flight.service;

import com.example.flight.dto.BookingRequestDTO;
import com.example.flight.dto.BookingResponseDTO;
import com.example.flight.dto.BookingSegmentResponseDTO;
import com.example.flight.entity.Booking;
import com.example.flight.entity.BookingSegment;
import com.example.flight.entity.Flight;
import com.example.flight.entity.FlightPricing;
import com.example.flight.entity.User;
import com.example.flight.repository.BookingRepository;
import com.example.flight.repository.BookingSegmentRepository;
import com.example.flight.repository.FlightPricingRepository;
import com.example.flight.repository.FlightRepository;
import com.example.flight.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import com.example.flight.entity.BookingStatus;
import com.example.flight.entity.PaymentStatus;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;

    private final UserRepository userRepository;

    private final FlightRepository flightRepository;

   

    private final FlightPricingRepository flightPricingRepository;

    private final BookingSegmentRepository bookingSegmentRepository;

    private final TripValidationService tripValidationService;
    


    // =========================================================
    // GET ALL BOOKINGS
    // =========================================================

    public List<BookingResponseDTO> getAllBookings() {

        return bookingRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // =========================================================
    // GET BOOKING BY ID
    // =========================================================

    public BookingResponseDTO getBookingById(
            Long bookingId) {

        Booking booking =
                bookingRepository.findById(bookingId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Booking not found with ID: "
                                                + bookingId
                                )
                        );

        return convertToResponse(booking);
    }


    // =========================================================
    // GET BOOKING BY CODE
    // =========================================================

    public BookingResponseDTO getBookingByCode(
            String bookingCode) {

        Booking booking =
                bookingRepository.findByBookingCode(
                        bookingCode
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking not found with code: "
                                        + bookingCode
                        )
                );

        return convertToResponse(booking);
    }


    // =========================================================
    // GET BOOKINGS BY USER
    // =========================================================

    public List<BookingResponseDTO> getBookingsByUser(
            Long userId) {

        if (!userRepository.existsById(userId)) {

            throw new RuntimeException(
                    "User not found with ID: "
                            + userId
            );
        }

        return bookingRepository
                .findByUserUserId(userId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // =========================================================
    // GET BOOKINGS BY FLIGHT
    // =========================================================

    /*
     * Temporarily using the old Booking -> Flight
     * relationship because Booking still contains flight_id.
     *
     * Later this can be migrated to:
     *
     * Booking -> BookingSegment -> Flight
     */

    public List<BookingResponseDTO> getBookingsByFlight(
            Long flightId) {

        if (!flightRepository.existsById(flightId)) {

            throw new RuntimeException(
                    "Flight not found with ID: "
                            + flightId
            );
        }

        return bookingRepository
                .findByFlightFlightId(flightId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // =========================================================
    // CREATE BOOKING
    // =========================================================

    @Transactional
    public BookingResponseDTO createBooking(
            BookingRequestDTO dto,
            String email) {


        // -----------------------------------------------------
        // 1. Get logged-in user
        // -----------------------------------------------------

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        // -----------------------------------------------------
        // 2. Validate flight list
        // -----------------------------------------------------

        if (dto.getFlightIds() == null ||
                dto.getFlightIds().isEmpty()) {

            throw new RuntimeException(
                    "At least one flight is required"
            );
        }


        // -----------------------------------------------------
        // 3. Find all selected flights
        // -----------------------------------------------------

        List<Flight> flights =
                dto.getFlightIds()
                        .stream()
                        .map(flightId ->
                                flightRepository
                                        .findById(flightId)
                                        .orElseThrow(() ->
                                                new RuntimeException(
                                                        "Flight not found with ID: "
                                                                + flightId
                                                )
                                        )
                        )
                        .toList();


        // -----------------------------------------------------
        // 4. Validate trip
        // -----------------------------------------------------

        tripValidationService.validateTrip(
                flights
        );


        // -----------------------------------------------------
        // 5. Create Booking
        // -----------------------------------------------------

        Booking booking =
                new Booking();

        booking.setUser(user);

        /*
         * Keep this temporarily because the current
         * Booking entity still contains flight_id.
         *
         * For a multi-flight booking, the first flight
         * is stored here temporarily.
         */
        booking.setFlight(
                flights.get(0)
        );

        booking.setBookingCode(
                generateBookingCode()
        );

       booking.setStatus(
        BookingStatus.PENDING
);

booking.setPaymentStatus(
        PaymentStatus.PENDING
);

        booking.setBookingTs(
                LocalDateTime.now()
        );


        // -----------------------------------------------------
        // 6. Calculate total fare
        // -----------------------------------------------------

        BigDecimal totalAmount =
                BigDecimal.ZERO;


        // -----------------------------------------------------
        // 7. Create booking segments
        // -----------------------------------------------------

        int segmentOrder = 1;


        for (Flight flight : flights) {


            // -------------------------------------------------
            // 7.1 Check flight availability
            // -------------------------------------------------

            if (flight.getAvailableSeats() == null ||
                    flight.getAvailableSeats() <= 0) {

                throw new RuntimeException(
                        "No seats available for flight ID: "
                                + flight.getFlightId()
                );
            }


            // -------------------------------------------------
            // 7.2 Find pricing for cabin class
            // -------------------------------------------------

            FlightPricing pricing =
                    flightPricingRepository
                            .findByFlightFlightIdAndSeatClass(
                                    flight.getFlightId(),
                                    dto.getCabinClass()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Pricing not available for flight "
                                                    + flight.getFlightId()
                                                    + " and cabin class "
                                                    + dto.getCabinClass()
                                    )
                            );


            // -------------------------------------------------
            // 7.3 Calculate fare for this segment
            // -------------------------------------------------

            BigDecimal segmentFare =
                    pricing.getBaseFare()
                            .add(pricing.getTaxes())
                            .add(pricing.getConvenienceFee());


            // -------------------------------------------------
            // 7.4 Add segment fare to total
            // -----------------------------------------------------

            totalAmount =
                    totalAmount.add(
                            segmentFare
                    );


            // -------------------------------------------------
            // 7.5 Create BookingSegment
            // -----------------------------------------------------

            BookingSegment segment =
                    new BookingSegment();

            segment.setBooking(
                    booking
            );

            segment.setFlight(
                    flight
            );

            segment.setSegmentOrder(
                    segmentOrder
            );


            // -------------------------------------------------
            // 7.6 Add segment to Booking
            // -----------------------------------------------------

            booking.getSegments()
                    .add(segment);


            segmentOrder++;
        }


        // -----------------------------------------------------
        // 8. Set final booking fare
        // -----------------------------------------------------

        booking.setTotalAmount(
                totalAmount
        );


        // -----------------------------------------------------
        // 9. Save Booking
        // -----------------------------------------------------

        Booking savedBooking =
                bookingRepository.save(
                        booking
                );


        // -----------------------------------------------------
        // 10. Return response
        // -----------------------------------------------------

        return convertToResponse(
                savedBooking
        );
    }


    // =========================================================
    // ENTITY -> RESPONSE DTO
    // =========================================================

    private BookingResponseDTO convertToResponse(
            Booking booking) {

        BookingResponseDTO response =
                new BookingResponseDTO();


        // -----------------------------------------------------
        // Booking ID
        // -----------------------------------------------------

        response.setBookingId(
                booking.getBookingId()
        );


        // -----------------------------------------------------
        // User ID
        // -----------------------------------------------------

        response.setUserId(
                booking.getUser()
                        .getUserId()
        );


        // -----------------------------------------------------
        // Booking Segments
        // -----------------------------------------------------

        response.setSegments(
                booking.getSegments()
                        .stream()
                        .map(segment -> {

                            BookingSegmentResponseDTO dto =
                                    new BookingSegmentResponseDTO();


                            dto.setSegmentId(
                                    segment.getSegmentId()
                            );


                            dto.setBookingId(
                                    booking.getBookingId()
                            );


                            dto.setFlightId(
                                    segment.getFlight()
                                            .getFlightId()
                            );


                            dto.setAirlineCode(
                                    segment.getFlight()
                                            .getAirline()
                                            .getAirlineCode()
                            );


                            dto.setFromAirport(
                                    segment.getFlight()
                                            .getFromAirport()
                                            .getAirportCode()
                            );


                            dto.setToAirport(
                                    segment.getFlight()
                                            .getToAirport()
                                            .getAirportCode()
                            );


                            dto.setDepartureTs(
                                    segment.getFlight()
                                            .getDepartureTs()
                            );


                            dto.setArrivalTs(
                                    segment.getFlight()
                                            .getArrivalTs()
                            );


                            dto.setSegmentOrder(
                                    segment.getSegmentOrder()
                            );


                            return dto;

                        })
                        .toList()
        );


        // -----------------------------------------------------
        // Booking Code
        // -----------------------------------------------------

        response.setBookingCode(
                booking.getBookingCode()
        );


        // -----------------------------------------------------
        // Booking Status
        // -----------------------------------------------------

        response.setStatus(
                booking.getStatus()
        );


        // -----------------------------------------------------
        // Payment Status
        // -----------------------------------------------------

        response.setPaymentStatus(
                booking.getPaymentStatus()
        );


        // -----------------------------------------------------
        // Total Amount
        // -----------------------------------------------------

        response.setTotalAmount(
                booking.getTotalAmount()
        );


        // -----------------------------------------------------
        // Booking Timestamp
        // -----------------------------------------------------

        response.setBookingTs(
                booking.getBookingTs()
        );


        return response;
    }


    // =========================================================
    // GENERATE UNIQUE BOOKING CODE
    // =========================================================

    private String generateBookingCode() {

        String code;

        do {

            code =
                    UUID.randomUUID()
                            .toString()
                            .replace("-", "")
                            .substring(0, 6)
                            .toUpperCase();

        } while (
                bookingRepository
                        .existsByBookingCode(code)
        );

        return code;
    }
}

