package com.flight.booking.repository;

import com.flight.booking.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FlightRepository extends JpaRepository<Flight, Long> {
    List<Flight> findByFromAirportIgnoreCaseAndToAirportIgnoreCase(String fromAirport, String toAirport);
}
