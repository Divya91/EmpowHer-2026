package com.example.flight.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.flight.entity.Flight;
import com.example.flight.service.FlightService;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

    @Autowired
    private FlightService flightService;

    // Add a new flight
    @PostMapping
    public Flight addFlight(@RequestBody Flight flight) {
        return flightService.addFlight(flight);
    }

    // Get all flights
    @GetMapping
    public List<Flight> getAllFlights() {
        return flightService.getAllFlights();
    }

    // Search flights
    @GetMapping("/search")
    public List<Flight> searchFlights(
            @RequestParam String source,
            @RequestParam String destination) {

        return flightService.searchFlights(source, destination);
    }
}