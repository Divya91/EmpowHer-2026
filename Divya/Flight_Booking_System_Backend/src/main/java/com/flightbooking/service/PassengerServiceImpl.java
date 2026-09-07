package com.flightbooking.service;

import com.flightbooking.entity.Passenger;
import com.flightbooking.exception.ResourceNotFoundException;
import com.flightbooking.repository.PassengerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PassengerServiceImpl implements PassengerService {

    private final PassengerRepository repository;

    public PassengerServiceImpl(PassengerRepository repository) {
        this.repository = repository;
    }

    @Override
    public Passenger addPassenger(Passenger passenger) {
        return repository.save(passenger);
    }

    @Override
    public Passenger getPassengerById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Passenger", "id", id));
    }

    @Override
    public List<Passenger> getAllPassengers() {
        return repository.findAll();
    }

    @Override
    public List<Passenger> getPassengersByBookingId(Long bookingId) {
        return repository.findByBooking_BookingId(bookingId);
    }

    @Override
    public Passenger updatePassenger(Long id, Passenger passenger) {
        Passenger existing = getPassengerById(id);
        existing.setFirstName(passenger.getFirstName());
        existing.setLastName(passenger.getLastName());
        existing.setDateOfBirth(passenger.getDateOfBirth());
        existing.setSeatNumber(passenger.getSeatNumber());
        existing.setPassportNumber(passenger.getPassportNumber());
        return repository.save(existing);
    }

    @Override
    public void deletePassenger(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Passenger", "id", id);
        }
        repository.deleteById(id);
    }
}
