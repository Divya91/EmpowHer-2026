package com.flightbooking.service;

import com.flightbooking.entity.Flight;
import com.flightbooking.exception.BookingException;
import com.flightbooking.exception.ResourceNotFoundException;
import com.flightbooking.repository.FlightRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class FlightServiceImpl implements FlightService {

    private final FlightRepository flightRepository;

    public FlightServiceImpl(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Flight> searchFlights(String origin, String destination, LocalDate date, int passengers) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);
        return flightRepository.searchFlights(origin, destination, startOfDay, endOfDay, passengers);
    }

    @Override
    @Transactional(readOnly = true)
    public Flight getFlightById(Long flightId) {
        return flightRepository.findById(flightId)
                .orElseThrow(() -> new ResourceNotFoundException("Flight", "id", flightId));
    }

    @Override
    public Flight createFlight(Flight flight) {
        if (flightRepository.existsByFlightNumber(flight.getFlightNumber())) {
            throw new BookingException("Flight number already exists: " + flight.getFlightNumber());
        }
        if (flight.getAvailableSeats() == null) {
            flight.setAvailableSeats(flight.getTotalSeats());
        }
        return flightRepository.save(flight);
    }

    @Override
    public Flight updateFlight(Long flightId, Flight flight) {
        Flight existing = getFlightById(flightId);

        existing.setFlightNumber(flight.getFlightNumber());
        existing.setAirline(flight.getAirline());
        existing.setOrigin(flight.getOrigin());
        existing.setDestination(flight.getDestination());
        existing.setDepartureTime(flight.getDepartureTime());
        existing.setArrivalTime(flight.getArrivalTime());
        existing.setTotalSeats(flight.getTotalSeats());
        existing.setPrice(flight.getPrice());

        if (flight.getStatus() != null) {
            existing.setStatus(flight.getStatus());
        }

        return flightRepository.save(existing);
    }

    @Override
    public void deleteFlight(Long flightId) {
        if (!flightRepository.existsById(flightId)) {
            throw new ResourceNotFoundException("Flight", "id", flightId);
        }
        flightRepository.deleteById(flightId);
    }

    @Override
    public Flight updateAvailableSeats(Long flightId, int delta) {
        Flight flight = getFlightById(flightId);
        int newAvailable = flight.getAvailableSeats() + delta;
        if (newAvailable < 0) {
            throw new BookingException("Not enough seats available on this flight");
        }
        if (newAvailable > flight.getTotalSeats()) {
            newAvailable = flight.getTotalSeats();
        }
        flight.setAvailableSeats(newAvailable);
        return flightRepository.save(flight);
    }
}
