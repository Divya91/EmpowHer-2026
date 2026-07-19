package com.ticket.booking.repository;

import com.ticket.booking.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;

import java.util.List;

public interface FlightRepository extends JpaRepository<Flight, String> {
    List<Flight> findByFromAirportIgnoreCaseAndToAirportIgnoreCase(String fromAirport, String toAirport);
}
