package com.flight.booking.controller;

import com.flight.booking.entity.Passenger;
import com.flight.booking.service.PassengerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/passengers")
@RequiredArgsConstructor
public class PassengerController {

    private final PassengerService passengerService;

    @PostMapping
    public ResponseEntity<Passenger> addPassenger(
            @RequestBody Passenger passenger) {

        Passenger savedPassenger = passengerService.savePassenger(passenger);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedPassenger);
    }
}