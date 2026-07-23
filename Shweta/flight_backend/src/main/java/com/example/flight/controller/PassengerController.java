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

   /*  @GetMapping
    public List<Passenger> getAllPassengers() {
        return passengerService.getAllPassengers();
    }

    @GetMapping("/{id}")
    public Passenger getPassengerById(@PathVariable Long id) {
        return passengerService.getPassengerById(id);
    }

    @DeleteMapping("/{id}")
    public String deletePassenger(@PathVariable Long id) {
       
}
    */
}