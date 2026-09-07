package com.flight.booking.repository;

import com.flight.booking.entity.Booking;
import com.flight.booking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserOrderByBookedAtDesc(User user);

    Optional<Booking> findByBookingReference(String bookingReference);
}
