package com.flightbooking.controller;

import com.flightbooking.entity.Flight;
import com.flightbooking.service.FlightService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/flights")
@CrossOrigin(origins = "http://localhost:4200")
public class FlightController {

    private final FlightService flightService;

    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }

    /**
     * Public: Search available flights
     * GET /api/flights/search?origin=Delhi&destination=Mumbai&date=2025-12-25&passengers=2
     */
    @GetMapping("/search")
    public List<Flight> searchFlights(
            @RequestParam String origin,
            @RequestParam String destination,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(defaultValue = "1") int passengers) {
        return flightService.searchFlights(origin, destination, date, passengers);
    }

    /**
     * Public: Get flight by ID
     */
    @GetMapping("/{id}")
    public Flight getFlightById(@PathVariable Long id) {
        return flightService.getFlightById(id);
    }

    /**
     * Admin only: Create a new flight
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public Flight createFlight(@Valid @RequestBody Flight flight) {
        return flightService.createFlight(flight);
    }

    /**
     * Admin only: Update a flight
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Flight updateFlight(@PathVariable Long id, @Valid @RequestBody Flight flight) {
        return flightService.updateFlight(id, flight);
    }

    /**
     * Admin only: Delete a flight
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteFlight(@PathVariable Long id) {
        flightService.deleteFlight(id);
    }
}
