package com.example.flight.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.flight.*;
import com.example.flight.repository.*;

@Service
public class PassengerService {

    @Autowired
    private PassengerRepository passengerRepository;

    public Passengers savePassenger(Passengers passenger) {

        return passengerRepository.save(passenger);
    }
}