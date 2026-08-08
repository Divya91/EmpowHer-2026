package com.example.flight.controller;

import com.example.flight.dto.PassengerRequestDTO;
import com.example.flight.dto.PassengerResponseDTO;
import com.example.flight.service.PassengerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/passengers")
@RequiredArgsConstructor
public class PassengerController {

    private final PassengerService passengerService;

    // Get all passengers
    @GetMapping
    public ResponseEntity<List<PassengerResponseDTO>> getAllPassengers() {

        return ResponseEntity.ok(
                passengerService.getAllPassengers()
        );
    }

    // Get passenger by ID
    @GetMapping("/{passengerId}")
    public ResponseEntity<PassengerResponseDTO> getPassengerById(
            @PathVariable Long passengerId) {

        return ResponseEntity.ok(
                passengerService.getPassengerById(passengerId)
        );
    }

    // Get passengers by booking
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<PassengerResponseDTO>> getPassengersByBooking(
            @PathVariable Long bookingId) {

        return ResponseEntity.ok(
                passengerService.getPassengersByBooking(bookingId)
        );
    }

    // Add passenger
    @PostMapping
    public ResponseEntity<PassengerResponseDTO> addPassenger(
            @Valid @RequestBody PassengerRequestDTO dto) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(passengerService.addPassenger(dto));
    }

    // Update passenger
    @PutMapping("/{passengerId}")
    public ResponseEntity<PassengerResponseDTO> updatePassenger(
            @PathVariable Long passengerId,
            @Valid @RequestBody PassengerRequestDTO dto) {

        return ResponseEntity.ok(
                passengerService.updatePassenger(
                        passengerId,
                        dto
                )
        );
    }

    // Delete passenger
    @DeleteMapping("/{passengerId}")
    public ResponseEntity<String> deletePassenger(
            @PathVariable Long passengerId) {

        passengerService.deletePassenger(passengerId);

        return ResponseEntity.ok(
                "Passenger deleted successfully"
        );
    }
}