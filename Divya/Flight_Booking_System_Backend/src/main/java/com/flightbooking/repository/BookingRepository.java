package com.flightbooking.repository;

import com.flightbooking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUser_UserId(Long userId);

    Optional<Booking> findByBookingIdAndUser_UserId(Long bookingId, Long userId);

    List<Booking> findByFlight_FlightId(Long flightId);
}
