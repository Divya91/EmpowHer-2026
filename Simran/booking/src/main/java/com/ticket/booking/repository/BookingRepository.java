package com.ticket.booking.repository;

import com.ticket.booking.entity.BookingStatus;
import com.ticket.booking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Integer> {

    List<Booking> findByUserId(Integer userId);

    long countByStatus(BookingStatus status);
}