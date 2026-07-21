package com.flight.booking.service.impl;

import com.flight.booking.entity.Passenger;
import com.flight.booking.repository.PassengerRepository;
import com.flight.booking.service.PassengerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PassengerServiceImpl implements PassengerService {

    private final PassengerRepository passengerRepository;

    @Override
    public Passenger savePassenger(Passenger passenger) {
        return passengerRepository.save(passenger);
    }
}