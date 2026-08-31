package com.skyroute.controller;

import com.skyroute.dto.flight.FlightResponseDto;
import com.skyroute.dto.flight.FlightSearchCriteria;
import com.skyroute.dto.flight.SeatDto;
import com.skyroute.entity.Airport;
import com.skyroute.repository.AirportRepository;
import com.skyroute.service.FlightService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/flights")
@RequiredArgsConstructor
@Tag(name = "Flights", description = "Public Flight Search, Details and Seat Maps")
public class FlightController {

    private final FlightService flightService;
    private final AirportRepository airportRepository;

    @GetMapping("/search")
    @Operation(summary = "Search scheduled flights by origin, destination, date and filters")
    public ResponseEntity<List<FlightResponseDto>> search(
            @RequestParam String origin,
            @RequestParam String destination,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate departureDate,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String airlineCode,
            @RequestParam(required = false) Boolean nonStopOnly
    ) {
        FlightSearchCriteria criteria = FlightSearchCriteria.builder()
                .origin(origin)
                .destination(destination)
                .departureDate(departureDate)
                .maxPrice(maxPrice)
                .airlineCode(airlineCode)
                .nonStopOnly(nonStopOnly)
                .build();

        return ResponseEntity.ok(flightService.searchFlights(criteria));
    }

    @GetMapping("/{scheduleId}")
    @Operation(summary = "Get detailed information for a specific flight schedule")
    public ResponseEntity<FlightResponseDto> getDetails(@PathVariable Long scheduleId) {
        return ResponseEntity.ok(flightService.getFlightDetails(scheduleId));
    }

    @GetMapping("/{scheduleId}/seats")
    @Operation(summary = "Get real-time interactive aircraft seat layout and availability map")
    public ResponseEntity<List<SeatDto>> getSeatMap(@PathVariable Long scheduleId) {
        return ResponseEntity.ok(flightService.getSeatMap(scheduleId));
    }

    @GetMapping("/airports")
    @Operation(summary = "Get list of active commercial airports for search autocomplete")
    public ResponseEntity<List<Airport>> getAirports() {
        return ResponseEntity.ok(airportRepository.findByIsActiveTrueOrderByNameAsc());
    }
}
