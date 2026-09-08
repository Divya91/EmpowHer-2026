package com.flyora.api.controller;

import com.flyora.api.entity.Passenger;
import com.flyora.api.service.PassengerService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/passengers")
@CrossOrigin(origins = "http://localhost:4200")
public class PassengerController {

    private final PassengerService passengerService;

    public PassengerController(PassengerService passengerService) {
        this.passengerService = passengerService;
    }

    @PostMapping
    public Passenger savePassenger(@RequestBody Passenger passenger) {
        return passengerService.savePassenger(passenger);
    }
}