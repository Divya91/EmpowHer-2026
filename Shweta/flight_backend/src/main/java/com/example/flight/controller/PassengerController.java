package com.example.flight.controller;


import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.flight.entity.Passengers;
import com.example.flight.service.PassengerService;

@RestController
@RequestMapping("/passengers")
public class PassengerController {

    @Autowired
    PassengerService passengerService;

   
    @PostMapping
    public Passengers savePassenger(@RequestBody Passengers passenger) {
        return passengerService.savePassenger(passenger);
    }

     @GetMapping
    public List<Passengers> getAllPassengers() {
        return passengerService.getAllPassengers();
    }

    @GetMapping("/{id}")
    public Passengers getPassengerById(@PathVariable Long id) {
        return passengerService.getPassengerById(id).orElse(null);
    }

    @GetMapping("/name/{name}")
    public List<Passengers> getPassengersByName(@PathVariable String name) {
        return passengerService.getPassengersByName(name);
    }

    @DeleteMapping("/{id}")
    public String deletePassenger(@PathVariable Long id) {
        passengerService.deletePassenger(id);
        return "Passenger with id " + id + " deleted successfully";
    }
    
}