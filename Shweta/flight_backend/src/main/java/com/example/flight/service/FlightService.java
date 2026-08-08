package com.example.flight.service;


import com.example.flight.dto.FlightRequestDTO;
import com.example.flight.dto.FlightResponseDTO;
import com.example.flight.entity.Airline;
import com.example.flight.entity.Airport;
import com.example.flight.entity.Flight;
import com.example.flight.repository.AirlineRepository;
import com.example.flight.repository.AirportRepository;
import com.example.flight.repository.FlightRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FlightService {

    private final FlightRepository flightRepository;
    private final AirlineRepository airlineRepository;
    private final AirportRepository airportRepository;

    // Get All Flights
    public List<FlightResponseDTO> getAllFlights() {

        return flightRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Get Flight By Id
    public FlightResponseDTO getFlightById(Long flightId) {

        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        return convertToResponse(flight);
    }

    // Search Flights
    public List<FlightResponseDTO> searchFlights(String source, String destination) {

        return flightRepository.findAll()
                .stream()
                .filter(flight -> source == null || source.isBlank()
                        || flight.getFromAirport().getAirportCode().equalsIgnoreCase(source))
                .filter(flight -> destination == null || destination.isBlank()
                        || flight.getToAirport().getAirportCode().equalsIgnoreCase(destination))
                .map(this::convertToResponse)
                .toList();
    }

    // Add Flight
    public FlightResponseDTO addFlight(FlightRequestDTO dto) {

        Airline airline = airlineRepository.findById(dto.getAirlineCode())
                .orElseThrow(() -> new RuntimeException("Airline not found"));

        Airport sourceAirport = airportRepository.findById(dto.getFromAirport())
                .orElseThrow(() -> new RuntimeException("Source Airport not found"));

        Airport destinationAirport = airportRepository.findById(dto.getToAirport())
                .orElseThrow(() -> new RuntimeException("Destination Airport not found"));

        Flight flight = new Flight();

        flight.setAirline(airline);
        flight.setFromAirport(sourceAirport);
        flight.setToAirport(destinationAirport);
        flight.setDepartureTs(dto.getDepartureTs());
        flight.setArrivalTs(dto.getArrivalTs());
        flight.setStops(dto.getStops());
        flight.setBasePrice(dto.getBasePrice());
        flight.setAvailableSeats(dto.getAvailableSeats());
        flight.setDurationMins(dto.getDurationMins());

        Flight savedFlight = flightRepository.save(flight);

        return convertToResponse(savedFlight);
    }

    // Update Flight
    public FlightResponseDTO updateFlight(Long flightId,
                                          FlightRequestDTO dto) {

        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        Airline airline = airlineRepository.findById(dto.getAirlineCode())
                .orElseThrow(() -> new RuntimeException("Airline not found"));

        Airport sourceAirport = airportRepository.findById(dto.getFromAirport())
                .orElseThrow(() -> new RuntimeException("Source Airport not found"));

        Airport destinationAirport = airportRepository.findById(dto.getToAirport())
                .orElseThrow(() -> new RuntimeException("Destination Airport not found"));

        flight.setAirline(airline);
        flight.setFromAirport(sourceAirport);
        flight.setToAirport(destinationAirport);
        flight.setDepartureTs(dto.getDepartureTs());
        flight.setArrivalTs(dto.getArrivalTs());
        flight.setStops(dto.getStops());
        flight.setBasePrice(dto.getBasePrice());
        flight.setAvailableSeats(dto.getAvailableSeats());
        flight.setDurationMins(dto.getDurationMins());

        Flight updatedFlight = flightRepository.save(flight);

        return convertToResponse(updatedFlight);
    }

    // Delete Flight
    public void deleteFlight(Long flightId) {

        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        flightRepository.delete(flight);
    }

    // Convert Entity to Response DTO
    private FlightResponseDTO convertToResponse(Flight flight) {

        FlightResponseDTO response = new FlightResponseDTO();

        response.setFlightId(flight.getFlightId());

        response.setAirlineCode(flight.getAirline().getAirlineCode());
        response.setAirlineName(flight.getAirline().getName());

        response.setFromAirport(flight.getFromAirport().getAirportCode());
        response.setToAirport(flight.getToAirport().getAirportCode());

        response.setDepartureTs(flight.getDepartureTs());
        response.setArrivalTs(flight.getArrivalTs());

        response.setStops(flight.getStops());
        response.setBasePrice(flight.getBasePrice());

        response.setAvailableSeats(flight.getAvailableSeats());
        response.setDurationMins(flight.getDurationMins());

        return response;
    }
}