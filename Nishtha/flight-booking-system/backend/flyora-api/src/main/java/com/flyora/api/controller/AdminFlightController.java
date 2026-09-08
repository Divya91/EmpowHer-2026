package com.flyora.api.controller;

import com.flyora.api.dto.request.CreateFlightRequest;
import com.flyora.api.dto.response.FlightResponse;
import com.flyora.api.service.FlightService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/flights")
public class AdminFlightController {

    private final FlightService flightService;

    public AdminFlightController(FlightService flightService) {
        this.flightService = flightService;
    }

    // ADMIN: Get all flights
    @GetMapping
    public ResponseEntity<List<FlightResponse>> getAllFlights() {

        return ResponseEntity.ok(
                flightService.getAllFlights()
        );
    }

    // ADMIN: Create flight
    @PostMapping
    public ResponseEntity<FlightResponse> createFlight(
            @Valid @RequestBody CreateFlightRequest request
    ) {

        FlightResponse response =
                flightService.createFlight(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // ADMIN: Delete flight
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlight(
            @PathVariable Long id
    ) {

        flightService.deleteFlight(id);

        return ResponseEntity.noContent().build();
    }
}