package com.example.flight.controller;
import com.example.flight.dto.AirportRequestDTO;
import com.example.flight.dto.AirportResponseDTO;
import com.example.flight.service.AirportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/airports")
@RequiredArgsConstructor
public class AirportController {

    private final AirportService airportService;

    // Get all airports
    @GetMapping
    public ResponseEntity<List<AirportResponseDTO>> getAllAirports() {

        return ResponseEntity.ok(airportService.getAllAirports());
    }

    // Get airport by code
    @GetMapping("/{airportCode}")
    public ResponseEntity<AirportResponseDTO> getAirportByCode(
            @PathVariable String airportCode) {

        return ResponseEntity.ok(
                airportService.getAirportByCode(airportCode));
    }

    // Add airport
    @PostMapping
    public ResponseEntity<AirportResponseDTO> addAirport(
             @RequestBody AirportRequestDTO airportRequestDTO) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(airportService.addAirport(airportRequestDTO));
    }

    // Update airport
    @PutMapping("/{airportCode}")
    public ResponseEntity<AirportResponseDTO> updateAirport(
            @PathVariable String airportCode,
         @RequestBody AirportRequestDTO airportRequestDTO) {

        return ResponseEntity.ok(
                airportService.updateAirport(airportCode, airportRequestDTO));
    }

    // Delete airport
    @DeleteMapping("/{airportCode}")
    public ResponseEntity<String> deleteAirport(
            @PathVariable String airportCode) {

        airportService.deleteAirport(airportCode);

        return ResponseEntity.ok("Airport deleted successfully.");
    }
}