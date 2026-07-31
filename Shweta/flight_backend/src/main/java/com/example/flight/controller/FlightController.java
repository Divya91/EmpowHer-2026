package com.example.flight.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.flight.dto.FlightRequestDTO;
import com.example.flight.dto.FlightResponseDTO;
import com.example.flight.service.FlightService;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

    @Autowired
    private FlightService flightService;

    // Add a new flight
    @PostMapping
    public FlightResponseDTO addFlight(@RequestBody FlightRequestDTO flightRequestDTO) {
        return flightService.addFlight(flightRequestDTO);
    }

    // Get all flights
    @GetMapping
    public List<FlightResponseDTO> getAllFlights() {
        return flightService.getAllFlights();
    }

    // Search flights
    @GetMapping("/search")
    public List<FlightResponseDTO> searchFlights(
            @RequestParam String source,
            @RequestParam String destination) {

        return flightService.searchFlights(source, destination);
    }
}
