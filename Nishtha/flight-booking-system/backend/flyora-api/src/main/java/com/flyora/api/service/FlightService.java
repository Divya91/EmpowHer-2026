package com.flyora.api.service;

import com.flyora.api.dto.request.CreateFlightRequest;
import com.flyora.api.dto.response.FlightResponse;
import com.flyora.api.entity.Flight;
import com.flyora.api.enums.CabinClass;
import com.flyora.api.repository.FlightRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
public class FlightService {

    private final FlightRepository flightRepository;

    public FlightService(
            FlightRepository flightRepository
    ) {
        this.flightRepository = flightRepository;
    }

    public FlightResponse createFlight(
            CreateFlightRequest request
    ) {

        Flight flight = Flight.builder()
                .flightNumber(request.getFlightNumber())
                .airline(request.getAirline())
                .fromAirport(request.getFromAirport())
                .toAirport(request.getToAirport())
                .travelDate(request.getTravelDate())
                .departureTime(request.getDepartureTime())
                .arrivalTime(request.getArrivalTime())
                .cabinClass(request.getCabinClass())
                .price(request.getPrice())
                .availableSeats(request.getAvailableSeats())
                .build();

        Flight savedFlight =
                flightRepository.save(flight);

        return mapToResponse(savedFlight);
    }
    

    public List<FlightResponse> getAllFlights() {

        return flightRepository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    public void deleteFlight(Long id) {

    if (!flightRepository.existsById(id)) {
        throw new RuntimeException("Flight not found with id: " + id);
    }

    flightRepository.deleteById(id);
}
public FlightResponse updateFlight(
        Long id,
        CreateFlightRequest request
) {

    Flight flight = flightRepository.findById(id)
            .orElseThrow(() ->
                    new RuntimeException(
                            "Flight not found with id: " + id
                    )
            );

    flight.setFlightNumber(request.getFlightNumber());
    flight.setAirline(request.getAirline());
    flight.setFromAirport(request.getFromAirport());
    flight.setToAirport(request.getToAirport());
    flight.setTravelDate(request.getTravelDate());
    flight.setDepartureTime(request.getDepartureTime());
    flight.setArrivalTime(request.getArrivalTime());
    flight.setCabinClass(request.getCabinClass());
    flight.setPrice(request.getPrice());
    flight.setAvailableSeats(request.getAvailableSeats());

    Flight updatedFlight =
            flightRepository.save(flight);

    return mapToResponse(updatedFlight);
}

    public List<FlightResponse> searchFlights(
            String from,
            String to,
            LocalDate travelDate,
            CabinClass cabinClass
    ) {

        return flightRepository
                .findByFromAirportIgnoreCaseAndToAirportIgnoreCaseAndTravelDateAndCabinClass(
                        from,
                        to,
                        travelDate,
                        cabinClass
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<String> getAirports() {

        Set<String> airports =
                new LinkedHashSet<>();

        airports.addAll(
                flightRepository.findDistinctSourceAirports()
        );

        airports.addAll(
                flightRepository.findDistinctDestinationAirports()
        );

        return new ArrayList<>(airports);
    }

    public List<String> getAirlines() {

        return flightRepository
                .findDistinctAirlines();
    }

    public List<String> getRoutes() {

        return flightRepository
                .findDistinctRoutes();
    }

    private FlightResponse mapToResponse(
            Flight flight
    ) {

        return new FlightResponse(
                flight.getId(),
                flight.getFlightNumber(),
                flight.getAirline(),
                flight.getFromAirport(),
                flight.getToAirport(),
                flight.getTravelDate(),
                flight.getDepartureTime(),
                flight.getArrivalTime(),
                flight.getCabinClass(),
                flight.getPrice(),
                flight.getAvailableSeats()
        );
    }
}