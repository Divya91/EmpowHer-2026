package com.flightbooking.controller;

import com.flightbooking.entity.Passenger;
import com.flightbooking.service.PassengerService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/passengers")
@CrossOrigin(origins = "http://localhost:4200")
@PreAuthorize("hasRole('ADMIN')")
public class PassengerController {

    private final PassengerService passengerService;

    public PassengerController(PassengerService passengerService) {
        this.passengerService = passengerService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Passenger addPassenger(@RequestBody Passenger passenger) {
        return passengerService.addPassenger(passenger);
    }

    @GetMapping
    public List<Passenger> getAllPassengers() {
        return passengerService.getAllPassengers();
    }

    @GetMapping("/{id}")
    public Passenger getPassengerById(@PathVariable Long id) {
        return passengerService.getPassengerById(id);
    }

    @GetMapping("/booking/{bookingId}")
    public List<Passenger> getPassengersByBookingId(@PathVariable Long bookingId) {
        return passengerService.getPassengersByBookingId(bookingId);
    }

    @PutMapping("/{id}")
    public Passenger updatePassenger(@PathVariable Long id, @RequestBody Passenger passenger) {
        return passengerService.updatePassenger(id, passenger);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePassenger(@PathVariable Long id) {
        passengerService.deletePassenger(id);
    }
}