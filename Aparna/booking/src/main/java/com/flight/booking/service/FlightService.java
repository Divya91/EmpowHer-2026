package com.flight.booking.service;

import com.flight.booking.dto.FlightResponse;
import com.flight.booking.entity.Flight;
import com.flight.booking.exception.ApiException;
import com.flight.booking.repository.FlightRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FlightService {

    private final FlightRepository flightRepository;

    public List<FlightResponse> searchFlights(String fromAirport, String toAirport, LocalDate date) {
        List<Flight> flights = (fromAirport == null || toAirport == null)
                ? flightRepository.findAll()
                : flightRepository.findByFromAirportIgnoreCaseAndToAirportIgnoreCase(fromAirport, toAirport);

        return flights.stream()
                .filter(f -> date == null || f.getDepartureTs().toLocalDate().isEqual(date))
                .map(this::toResponse)
                .toList();
    }

    public Flight getFlightOrThrow(Long flightId) {
        return flightRepository.findById(flightId)
                .orElseThrow(() -> new ApiException("Flight not found: " + flightId));
    }

    public FlightResponse getFlightResponseOrThrow(Long flightId) {
        return toResponse(getFlightOrThrow(flightId));
    }

    public void reserveSeats(Flight flight, int seats) {
        if (flight.getSeatsLeft() < seats) {
            throw new ApiException("Only " + flight.getSeatsLeft() + " seat(s) left on this flight");
        }
        flight.setSeatsLeft(flight.getSeatsLeft() - seats);
        flightRepository.save(flight);
    }

    private FlightResponse toResponse(Flight f) {
        return FlightResponse.builder()
                .flightId(f.getFlightId())
                .flightNumber(f.getFlightNumber())
                .airlineCode(f.getAirlineCode())
                .airlineName(f.getAirlineName())
                .fromAirport(f.getFromAirport())
                .toAirport(f.getToAirport())
                .departureTs(f.getDepartureTs())
                .arrivalTs(f.getArrivalTs())
                .stops(f.getStops())
                .durationMins(f.getDurationMins())
                .basePrice(f.getBasePrice())
                .aircraft(f.getAircraft())
                .seatsLeft(f.getSeatsLeft())
                .build();
    }
}
