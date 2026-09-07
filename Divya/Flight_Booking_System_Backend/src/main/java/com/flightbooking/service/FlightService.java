package com.flightbooking.service;

import com.flightbooking.entity.Flight;

import java.time.LocalDate;
import java.util.List;

public interface FlightService {

    List<Flight> searchFlights(String origin, String destination, LocalDate date, int passengers);

    Flight getFlightById(Long flightId);

    Flight createFlight(Flight flight);

    Flight updateFlight(Long flightId, Flight flight);

    void deleteFlight(Long flightId);

    Flight updateAvailableSeats(Long flightId, int delta);
}
