package com.example.flight.service;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.flight.repository.*;
import com.example.flight.entity.Passengers;

@Service
public class PassengerService {

    @Autowired
    private PassengerRepository passengerRepository;

    public Passengers savePassenger(Passengers passenger) {
        return passengerRepository.save(passenger);
    }

    public Optional<Passengers> getPassengerById(Long id) {
        return passengerRepository.findById(id);
    }

    public void deletePassenger(Long id) {
        passengerRepository.deleteById(id);
    }

    public List<Passengers> getAllPassengers() {
        return passengerRepository.findAll();
    }

    public List<Passengers> getPassengersByName(String name) {
        return passengerRepository.findByNameContainingIgnoreCase(name);
    }
}