package com.ticket.booking.service;

import com.ticket.booking.entity.Passenger;
import com.ticket.booking.repository.PassengerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PassengerService {

    private final PassengerRepository passengerRepository;

    public Passenger addPassenger(Passenger passenger) {
        return passengerRepository.save(passenger);
    }

    public List<Passenger> getAllPassengers() {
        return passengerRepository.findAll();
    }

    public Passenger getPassengerById(Integer id) {
        return passengerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Passenger not found"));
    }

    public Passenger updatePassenger(Passenger passenger) {
        return passengerRepository.save(passenger);
    }

    public void deletePassenger(Integer id) {
        passengerRepository.deleteById(id);
    }
}