package com.flyora.api.controller;

import com.flyora.api.dto.request.CreateFlightRequest;
import com.flyora.api.dto.response.FlightResponse;
import com.flyora.api.enums.CabinClass;
import com.flyora.api.service.FlightService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

    private final FlightService flightService;

    public FlightController(
            FlightService flightService
    ) {
        this.flightService = flightService;
    }

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

    @GetMapping
    public ResponseEntity<List<FlightResponse>> getAllFlights() {

        return ResponseEntity.ok(
                flightService.getAllFlights()
        );
    }

    @GetMapping("/search")
    public ResponseEntity<List<FlightResponse>> searchFlights(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam LocalDate travelDate,
            @RequestParam CabinClass cabinClass
    ) {

        return ResponseEntity.ok(
                flightService.searchFlights(
                        from,
                        to,
                        travelDate,
                        cabinClass
                )
        );
    }

    @GetMapping("/airports")
    public ResponseEntity<List<String>> getAirports() {

        return ResponseEntity.ok(
                flightService.getAirports()
        );
    }

    @GetMapping("/airlines")
    public ResponseEntity<List<String>> getAirlines() {

        return ResponseEntity.ok(
                flightService.getAirlines()
        );
    }

    @GetMapping("/routes")
    public ResponseEntity<List<String>> getRoutes() {

        return ResponseEntity.ok(
                flightService.getRoutes()
        );
    }
}