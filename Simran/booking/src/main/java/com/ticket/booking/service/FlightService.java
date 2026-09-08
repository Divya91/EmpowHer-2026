package com.ticket.booking.service;

import com.ticket.booking.dto.FlightRequest;
import com.ticket.booking.entity.Flight;
import com.ticket.booking.repository.FlightRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FlightService {

    private final FlightRepository flightRepository;

    public List<Flight> searchFlights(
            String source,
            String destination,
            LocalDate date) {

        return flightRepository
                .findBySourceAndDestinationAndDepartureDate(
                        source,
                        destination,
                        date
                );
    }

    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    public Flight getFlightById(Integer id) {
        return flightRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Flight not found"));
    }

    public Flight addFlight(FlightRequest request) {

        Flight flight = Flight.builder()
                .flightNumber(request.getFlightNumber())
                .airline(request.getAirline())
                .source(request.getSource())
                .destination(request.getDestination())
                .departureDate(request.getDepartureDate())
                .departureTime(request.getDepartureTime())
                .arrivalTime(request.getArrivalTime())
                .duration(request.getDuration())
                .stops(request.getStops())
                .price(request.getPrice())
                .availableSeats(request.getAvailableSeats())
                .build();

        return flightRepository.save(flight);
    }

    public Flight updateFlight(Integer id, FlightRequest request) {

        Flight flight = getFlightById(id);

        flight.setFlightNumber(request.getFlightNumber());
        flight.setAirline(request.getAirline());
        flight.setSource(request.getSource());
        flight.setDestination(request.getDestination());
        flight.setDepartureDate(request.getDepartureDate());
        flight.setDepartureTime(request.getDepartureTime());
        flight.setArrivalTime(request.getArrivalTime());
        flight.setDuration(request.getDuration());
        flight.setStops(request.getStops());
        flight.setPrice(request.getPrice());
        flight.setAvailableSeats(request.getAvailableSeats());

        return flightRepository.save(flight);
    }

    public void deleteFlight(Integer id) {

        if (!flightRepository.existsById(id)) {
            throw new RuntimeException("Flight not found");
        }

        flightRepository.deleteById(id);
    }
}