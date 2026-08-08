package com.example.flight.controller;


import com.example.flight.dto.AirlineRequestDTO;
import com.example.flight.dto.AirlineResponseDTO;
import com.example.flight.service.AirlineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/airlines")
@RequiredArgsConstructor
public class AirlineController {

    private final AirlineService airlineService;

    // Get All Airlines
    @GetMapping
    public ResponseEntity<List<AirlineResponseDTO>> getAllAirlines() {

        return ResponseEntity.ok(
                airlineService.getAllAirlines());
    }

    // Get Airline By Code
    @GetMapping("/{airlineCode}")
    public ResponseEntity<AirlineResponseDTO> getAirlineByCode(
            @PathVariable String airlineCode) {

        return ResponseEntity.ok(
                airlineService.getAirlineByCode(airlineCode));
    }

    // Add Airline
    @PostMapping
    public ResponseEntity<AirlineResponseDTO> addAirline(
            @Valid @RequestBody AirlineRequestDTO dto) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(airlineService.addAirline(dto));
    }

    // Update Airline
    @PutMapping("/{airlineCode}")
    public ResponseEntity<AirlineResponseDTO> updateAirline(
            @PathVariable String airlineCode,
            @Valid @RequestBody AirlineRequestDTO dto) {

        return ResponseEntity.ok(
                airlineService.updateAirline(airlineCode, dto));
    }

    // Delete Airline
    @DeleteMapping("/{airlineCode}")
    public ResponseEntity<String> deleteAirline(
            @PathVariable String airlineCode) {

        airlineService.deleteAirline(airlineCode);

        return ResponseEntity.ok("Airline deleted successfully.");
    }
}