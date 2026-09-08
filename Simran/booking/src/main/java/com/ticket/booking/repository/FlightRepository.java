package com.ticket.booking.repository;

import com.ticket.booking.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface FlightRepository extends JpaRepository<Flight, Integer> {

    List<Flight> findBySourceAndDestinationAndDepartureDate(
            String source,
            String destination,
            LocalDate departureDate
    );
}