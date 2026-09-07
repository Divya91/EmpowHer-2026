package com.ticket.booking.controller;

import com.ticket.booking.entity.Passenger;
import com.ticket.booking.service.PassengerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/passengers")
@RequiredArgsConstructor
public class PassengerController {

    private final PassengerService passengerService;

    @PostMapping
    public Passenger addPassenger(
            @RequestBody Passenger passenger) {

        return passengerService.addPassenger(passenger);
    }

    @GetMapping
    public List<Passenger> getAllPassengers() {
        return passengerService.getAllPassengers();
    }

    @GetMapping("/{id}")
    public Passenger getPassengerById(
            @PathVariable Integer id) {

        return passengerService.getPassengerById(id);
    }

    @PutMapping
    public Passenger updatePassenger(
            @RequestBody Passenger passenger) {

        return passengerService.updatePassenger(passenger);
    }

    @DeleteMapping("/{id}")
    public String deletePassenger(
            @PathVariable Integer id) {

        passengerService.deletePassenger(id);

        return "Passenger deleted successfully";
    }
}