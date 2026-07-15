package com.example.flight.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.flight.entity.Flight;
import com.example.flight.repository.FlightRepository;

@Service
public class FlightService {

    @Autowired
    private FlightRepository flightRepository;

    // Add a new flight
    public Flight addFlight(Flight flight) {
        return flightRepository.save(flight);
    }

    // Get all flights
    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    // Search flights by source and destination
    public List<Flight> searchFlights(String source, String destination) {
        return flightRepository.findBySourceAndDestination(source, destination);
    }
}