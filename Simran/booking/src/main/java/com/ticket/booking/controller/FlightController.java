package com.ticket.booking.controller;

import com.ticket.booking.dto.FlightRequest;
import com.ticket.booking.entity.Flight;
import com.ticket.booking.service.FlightService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/flights")
@RequiredArgsConstructor
public class FlightController {

    private final FlightService flightService;

    @GetMapping
    public List<Flight> searchFlights(
            @RequestParam String src,
            @RequestParam String dest,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date) {

        return flightService.searchFlights(src, dest, date);
    }

    @GetMapping("/all")
    public List<Flight> getAllFlights() {
        return flightService.getAllFlights();
    }

    @GetMapping("/{id}")
    public Flight getFlight(@PathVariable Integer id) {
        return flightService.getFlightById(id);
    }

    @PostMapping
    public Flight addFlight(@RequestBody FlightRequest request) {
        return flightService.addFlight(request);
    }

    @PutMapping("/{id}")
    public Flight updateFlight(
            @PathVariable Integer id,
            @RequestBody FlightRequest request) {

        return flightService.updateFlight(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteFlight(@PathVariable Integer id) {

        flightService.deleteFlight(id);

        return "Flight deleted successfully";
    }
}