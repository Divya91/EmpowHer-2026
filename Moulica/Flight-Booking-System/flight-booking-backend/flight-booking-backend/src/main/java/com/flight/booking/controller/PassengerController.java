package com.flight.booking.controller;

import com.flight.booking.dto.request.PassengerRequestDTO;
import com.flight.booking.dto.response.PassengerResponseDTO;
import com.flight.booking.service.PassengerService;
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

    // Create Passenger
    @PostMapping
    public ResponseEntity<PassengerResponseDTO> createPassenger(
            @Valid @RequestBody PassengerRequestDTO dto) {

        PassengerResponseDTO response =
                passengerService.createPassenger(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // Get All Passengers
    @GetMapping
    public List<PassengerResponseDTO> getAllPassengers() {
        return passengerService.getAllPassengers();
    }

    // Get Passenger By ID
    @GetMapping("/{id}")
    public PassengerResponseDTO getPassengerById(
            @PathVariable Long id) {

        return passengerService.getPassengerById(id);
    }

    // Update Passenger
    @PutMapping("/{id}")
    public ResponseEntity<PassengerResponseDTO> updatePassenger(
            @PathVariable Long id,
            @Valid @RequestBody PassengerRequestDTO dto) {

        PassengerResponseDTO response =
                passengerService.updatePassenger(id, dto);

        return ResponseEntity.ok(response);
    }

    // Delete Passenger
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePassenger(
            @PathVariable Long id) {

        passengerService.deletePassenger(id);

        return ResponseEntity.noContent().build();
    }
}