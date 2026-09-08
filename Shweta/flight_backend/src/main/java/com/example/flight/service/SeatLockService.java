package com.example.flight.service;

import com.example.flight.dto.SeatLockRequestDTO;
import com.example.flight.dto.SeatLockResponseDTO;
import com.example.flight.entity.Booking;
import com.example.flight.entity.BookingSegment;
import com.example.flight.entity.Flight;
import com.example.flight.entity.Passenger;
import com.example.flight.entity.SeatLock;
import com.example.flight.entity.BookingStatus;
import com.example.flight.entity.SeatLockStatus;
import com.example.flight.repository.BookingSegmentRepository;
import com.example.flight.repository.FlightRepository;
import com.example.flight.repository.PassengerRepository;
import com.example.flight.repository.SeatLockRepository;


import lombok.RequiredArgsConstructor;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SeatLockService {

    private final SeatLockRepository seatLockRepository;

    private final BookingSegmentRepository bookingSegmentRepository;

    private final PassengerRepository passengerRepository;

    private final FlightRepository flightRepository;


    // Seat lock duration
    private static final int LOCK_DURATION_MINUTES = 10;

    // Simple seat layout for student project
    private static final int TOTAL_ROWS = 30;

    private static final String[] SEAT_LETTERS = {
            "A", "B", "C", "D"
    };


    // =========================================================
    // ALLOCATE AND LOCK SEAT
    // =========================================================

    @Transactional
    public SeatLockResponseDTO allocateAndLockSeat(
            SeatLockRequestDTO request,
            String email) {


        // -----------------------------------------------------
        // 1. Find booking segment
        // -----------------------------------------------------

        BookingSegment segment =
                bookingSegmentRepository
                        .findById(request.getSegmentId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Booking segment not found with ID: "
                                                + request.getSegmentId()
                                )
                        );


        // -----------------------------------------------------
        // 2. Get booking
        // -----------------------------------------------------

        Booking booking =
                segment.getBooking();


        // -----------------------------------------------------
        // 3. Check booking status
        // -----------------------------------------------------

        if (booking.getStatus()
                != BookingStatus.PENDING) {

            throw new RuntimeException(
                    "Seat can only be allocated "
                    + "for a pending booking"
            );
        }


        // -----------------------------------------------------
        // 4. Check booking ownership
        // -----------------------------------------------------

        if (!booking.getUser()
                .getEmail()
                .equalsIgnoreCase(email)) {

            throw new RuntimeException(
                    "You are not allowed to modify "
                    + "this booking"
            );
        }


        // -----------------------------------------------------
        // 5. Find passenger
        // -----------------------------------------------------

        Passenger passenger =
                passengerRepository
                        .findById(
                                request.getPassengerId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Passenger not found with ID: "
                                                + request.getPassengerId()
                                )
                        );


        // -----------------------------------------------------
        // 6. Check passenger belongs to booking
        // -----------------------------------------------------

        if (!passenger.getBooking()
                .getBookingId()
                .equals(
                        booking.getBookingId()
                )) {

            throw new RuntimeException(
                    "Passenger does not belong "
                    + "to this booking"
            );
        }


        // -----------------------------------------------------
        // 7. Get flight
        // -----------------------------------------------------

        Flight flight =
                segment.getFlight();


        // -----------------------------------------------------
        // 8. Check available seats
        // -----------------------------------------------------

        if (flight.getAvailableSeats() == null
                || flight.getAvailableSeats() <= 0) {

            throw new RuntimeException(
                    "No seats available for this flight"
            );
        }


        // -----------------------------------------------------
        // 9. Check if passenger already has a seat
        // -----------------------------------------------------

        List<SeatLock> passengerLocks =
                seatLockRepository
                        .findByPassengerPassengerId(
                                passenger.getPassengerId()
                        );

        boolean alreadyAllocated =
                passengerLocks.stream()
                        .anyMatch(lock ->
                                lock.getBookingSegment()
                                        .getSegmentId()
                                        .equals(
                                                segment.getSegmentId()
                                        )
                                &&
                                (
                                    lock.getStatus()
                                            == SeatLockStatus.LOCKED
                                    ||
                                    lock.getStatus()
                                            == SeatLockStatus.CONFIRMED
                                )
                        );

        if (alreadyAllocated) {

            throw new RuntimeException(
                    "Passenger already has "
                    + "a seat for this segment"
            );
        }

        // -----------------------------------------------------
        // 10. Find available seat
        // -----------------------------------------------------

        String seatNumber =
                findAvailableSeat(
                        flight.getFlightId()
                );


        // -----------------------------------------------------
        // 11. Create SeatLock
        // -----------------------------------------------------

        SeatLock seatLock =
                new SeatLock();

        seatLock.setFlight(
                flight
        );

        seatLock.setBooking(
                booking
        );

        seatLock.setBookingSegment(
                segment
        );

        seatLock.setPassenger(
                passenger
        );

        seatLock.setSeatNumber(
                seatNumber
        );

        seatLock.setStatus(
                SeatLockStatus.LOCKED
        );


        // -----------------------------------------------------
        // 12. Set lock time
        // -----------------------------------------------------

        LocalDateTime now =
                LocalDateTime.now();

        seatLock.setLockedAt(
                now
        );

        seatLock.setLockedUntil(
                now.plusMinutes(
                        LOCK_DURATION_MINUTES
                )
        );


        // -----------------------------------------------------
        // 13. Save seat lock
        // -----------------------------------------------------

        SeatLock savedSeatLock =
                seatLockRepository.save(
                        seatLock
                );


        // -----------------------------------------------------
        // 14. Return response
        // -----------------------------------------------------

        return convertToResponse(
                savedSeatLock
        );
    }

    // =========================================================
    // RELEASE EXPIRED SEAT LOCKS
    // =========================================================
/* 
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void releaseExpiredSeatLocks() {

        LocalDateTime now = LocalDateTime.now();

        List<SeatLock> lockedSeats =
                seatLockRepository.findByStatus(
                        SeatLockStatus.LOCKED
                );

        boolean updated = false;

        for (SeatLock seatLock : lockedSeats) {

            if (seatLock.getLockedUntil() != null &&
                    seatLock.getLockedUntil().isBefore(now)) {

                seatLock.setStatus(
                        SeatLockStatus.EXPIRED
                );
                updated = true;
            }
        }

        if (updated) {
            seatLockRepository.saveAll(lockedSeats);
        }
    }
        */


    // =========================================================
    // FIND AVAILABLE SEAT
    // =========================================================

    private String findAvailableSeat(
            Long flightId) {


        // Active seat statuses
        List<SeatLockStatus> activeStatuses =
                List.of(
                        SeatLockStatus.LOCKED,
                        SeatLockStatus.CONFIRMED
                );


        // Check every possible seat
        for (int row = 1;
             row <= TOTAL_ROWS;
             row++) {

            for (String letter : SEAT_LETTERS) {


                String seatNumber =
                        row + letter;


                // Check whether this seat is occupied
                boolean occupied =
                        seatLockRepository
                                .findByFlightFlightIdAndSeatNumberAndStatusIn(
                                        flightId,
                                        seatNumber,
                                        activeStatuses
                                )
                                .isPresent();


                // First free seat
                if (!occupied) {

                    return seatNumber;
                }
            }
        }


        throw new RuntimeException(
                "No seat available for this flight"
        );
    }


    // =========================================================
    // GET SEAT LOCKS FOR BOOKING
    // =========================================================

    public List<SeatLockResponseDTO> getBookingSeatLocks(
            Long bookingId) {

        return seatLockRepository
                .findByBookingBookingId(
                        bookingId
                )
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // =========================================================
    // CONVERT ENTITY → RESPONSE DTO
    // =========================================================

    private SeatLockResponseDTO convertToResponse(
            SeatLock seatLock) {

        SeatLockResponseDTO response =
                new SeatLockResponseDTO();


        response.setSeatLockId(
                seatLock.getSeatLockId()
        );


        response.setBookingId(
                seatLock.getBooking()
                        .getBookingId()
        );


        response.setSegmentId(
                seatLock.getBookingSegment()
                        .getSegmentId()
        );


        response.setFlightId(
                seatLock.getFlight()
                        .getFlightId()
        );


        response.setPassengerId(
                seatLock.getPassenger()
                        .getPassengerId()
        );


        response.setSeatNumber(
                seatLock.getSeatNumber()
        );


        response.setStatus(
                seatLock.getStatus()
        );


        response.setLockedAt(
                seatLock.getLockedAt()
        );


        response.setLockedUntil(
                seatLock.getLockedUntil()
        );


        return response;
    }
}