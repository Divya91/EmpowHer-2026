package com.empowher.flight_management_system.service;

import com.empowher.flight_management_system.entity.Flight;
import com.empowher.flight_management_system.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FlightService {

    @Autowired
    private FlightRepository flightRepository;

    // Get all flights
    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    // Get a single flight by id
    public Optional<Flight> getFlightById(Long id) {
        return flightRepository.findById(id);
    }

    // Add a new flight
    public Flight addFlight(Flight flight) {
        return flightRepository.save(flight);
    }

    // Update an existing flight
    public Flight updateFlight(Long id, Flight flightDetails) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found with id " + id));

        flight.setFlightNumber(flightDetails.getFlightNumber());
        flight.setAirline(flightDetails.getAirline());
        flight.setOrigin(flightDetails.getOrigin());
        flight.setDestination(flightDetails.getDestination());
        flight.setDepartureTime(flightDetails.getDepartureTime());
        flight.setArrivalTime(flightDetails.getArrivalTime());
        flight.setTotalSeats(flightDetails.getTotalSeats());
        flight.setAvailableSeats(flightDetails.getAvailableSeats());
        flight.setPrice(flightDetails.getPrice());

        return flightRepository.save(flight);
    }

    // Delete a flight
    public void deleteFlight(Long id) {
        flightRepository.deleteById(id);
    }
}s