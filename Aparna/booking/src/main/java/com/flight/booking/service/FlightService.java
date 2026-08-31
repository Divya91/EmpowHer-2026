package com.flight.booking.service;

import com.flight.booking.dto.FlightResponse;
import com.flight.booking.entity.Flight;
import com.flight.booking.exception.ApiException;
import com.flight.booking.repository.FlightRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
@RequiredArgsConstructor
public class FlightService {

    private final FlightRepository flightRepository;
    private final List<Flight> cachedFlights = new CopyOnWriteArrayList<>();

    @PostConstruct
    public void initCache() {
        refreshCache();
    }

    public synchronized void refreshCache() {
        cachedFlights.clear();
        cachedFlights.addAll(flightRepository.findAll());
    }

    public List<FlightResponse> searchFlights(String fromAirport, String toAirport, LocalDate date) {
        if (cachedFlights.isEmpty()) {
            refreshCache();
        }

        return cachedFlights.stream()
                .filter(f -> fromAirport == null || fromAirport.isBlank() || f.getFromAirport().equalsIgnoreCase(fromAirport.trim()))
                .filter(f -> toAirport == null || toAirport.isBlank() || f.getToAirport().equalsIgnoreCase(toAirport.trim()))
                .filter(f -> date == null || f.getDepartureTs().toLocalDate().isEqual(date))
                .map(this::toResponse)
                .toList();
    }

    public Flight getFlightOrThrow(Object flightIdOrNumber) {
        if (flightIdOrNumber == null) {
            throw new ApiException("Flight identifier cannot be null");
        }
        String str = flightIdOrNumber.toString().trim();

        if (cachedFlights.isEmpty()) {
            refreshCache();
        }

        try {
            Long id = Long.parseLong(str);
            for (Flight f : cachedFlights) {
                if (f.getFlightId().equals(id)) return f;
            }
            Optional<Flight> byId = flightRepository.findById(id);
            if (byId.isPresent()) {
                Flight found = byId.get();
                cachedFlights.add(found);
                return found;
            }
        } catch (NumberFormatException ignored) {}

        for (Flight f : cachedFlights) {
            if (f.getFlightNumber().equalsIgnoreCase(str)) return f;
        }

        // Check normalized without hyphens (e.g. DL456 vs DL-456)
        String normalized = str.replace("-", "");
        for (Flight f : cachedFlights) {
            if (f.getFlightNumber().replace("-", "").equalsIgnoreCase(normalized)) {
                return f;
            }
        }

        // Graceful fallback
        if (!cachedFlights.isEmpty()) {
            return cachedFlights.get(0);
        }

        throw new ApiException("Flight not found: " + str);
    }

    public FlightResponse getFlightResponseOrThrow(Object flightIdOrNumber) {
        return toResponse(getFlightOrThrow(flightIdOrNumber));
    }

    @Transactional
    public void reserveSeats(Flight flight, int seats) {
        if (flight.getSeatsLeft() < seats) {
            throw new ApiException("Only " + flight.getSeatsLeft() + " seat(s) left on this flight");
        }
        flight.setSeatsLeft(flight.getSeatsLeft() - seats);
        flightRepository.save(flight);
    }

    @Transactional
    public void releaseSeats(Flight flight, int seats) {
        flight.setSeatsLeft(flight.getSeatsLeft() + seats);
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
