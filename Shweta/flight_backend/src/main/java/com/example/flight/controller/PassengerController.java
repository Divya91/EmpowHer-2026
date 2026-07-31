package com.example.flight.controller;


import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.flight.dto.PassengerRequestDTO;
import com.example.flight.dto.PassengerResponseDTO;
import com.example.flight.service.PassengerService;

@RestController
@RequestMapping("/passengers")
public class PassengerController {

    @Autowired
    PassengerService passengerService;

   
    @PostMapping
    public PassengerResponseDTO savePassenger(@RequestBody PassengerRequestDTO passengerRequestDTO) {
        return passengerService.savePassenger(passengerRequestDTO);
    }

     @GetMapping
    public List<PassengerResponseDTO> getAllPassengers() {
        return passengerService.getAllPassengers();
    }

    @GetMapping("/{id}")
    public PassengerResponseDTO getPassengerById(@PathVariable Long id) {
        return passengerService.getPassengerDTOById(id);
    }

    @GetMapping("/name/{name}")
    public List<PassengerResponseDTO> getPassengersByName(@PathVariable String name) {
        return passengerService.getPassengersByName(name);
    }

    @DeleteMapping("/{id}")
    public String deletePassenger(@PathVariable Long id) {
        passengerService.deletePassenger(id);
        return "Passenger with id " + id + " deleted successfully";
    }
    
}
