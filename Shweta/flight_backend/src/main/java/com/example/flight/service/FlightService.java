package com.example.flight.service;


import com.example.flight.dto.FlightRequestDTO;
import com.example.flight.dto.FlightResponseDTO;
import com.example.flight.dto.FlightSearchRequestDTO;
import com.example.flight.dto.FlightStatusRequestDTO;
import com.example.flight.entity.Airline;
import com.example.flight.entity.Airport;
import com.example.flight.entity.Flight;
import com.example.flight.entity.FlightStatus;
import com.example.flight.repository.AirlineRepository;
import com.example.flight.repository.AirportRepository;
import com.example.flight.repository.FlightRepository;
import lombok.RequiredArgsConstructor;


import org.modelmapper.ModelMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

import org.springframework.data.domain.Page;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;



import java.util.List;

@Service
@RequiredArgsConstructor
public class FlightService {

    private final FlightRepository flightRepository;
    private final AirlineRepository airlineRepository;
    private final AirportRepository airportRepository;
        private final ModelMapper modelMapper;

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
    public Page<FlightResponseDTO> searchFlights(
        FlightSearchRequestDTO request) {

    LocalDateTime startDateTime = null;
    LocalDateTime endDateTime = null;

    if (request.getDate() != null) {

        startDateTime =
                request.getDate().atStartOfDay();

        endDateTime =
                request.getDate()
                        .plusDays(1)
                        .atStartOfDay();
    }

    String sortField =
            getSortField(request.getSortBy());

    Sort.Direction direction =
            "desc".equalsIgnoreCase(
                    request.getSortDirection()
            )
            ? Sort.Direction.DESC
            : Sort.Direction.ASC;

    Pageable pageable =
            PageRequest.of(
                    request.getPage(),
                    request.getSize(),
                    Sort.by(direction, sortField)
            );

    return flightRepository.searchFlights(

            request.getSource(),

            request.getDestination(),

            request.getDate(),

            startDateTime,

            endDateTime,

            request.getAirline(),

            request.getFlightNumber(),

            request.getStops(),

            request.getMinPrice(),

            request.getMaxPrice(),

            request.getMaxDuration(),

            pageable

    ).map(this::convertToResponse);
}
    // Add Flight
    public FlightResponseDTO addFlight(FlightRequestDTO dto) {

    Airline airline = airlineRepository.findById(dto.getAirlineCode())
            .orElseThrow(() -> new RuntimeException("Airline not found"));

    Airport sourceAirport = airportRepository.findById(dto.getFromAirport())
            .orElseThrow(() -> new RuntimeException("Source Airport not found"));

    Airport destinationAirport = airportRepository.findById(dto.getToAirport())
            .orElseThrow(() -> new RuntimeException("Destination Airport not found"));

    Flight flight = modelMapper.map(dto, Flight.class);

    flight.setAirline(airline);
    flight.setFromAirport(sourceAirport);
    flight.setToAirport(destinationAirport);
     flight.setStatus(FlightStatus.SCHEDULED);
    Flight savedFlight = flightRepository.save(flight);

    return convertToResponse(savedFlight);
}

    // Update Flight
   public FlightResponseDTO updateFlight(
        Long flightId,
        FlightRequestDTO dto) {

    Flight flight = flightRepository.findById(flightId)
            .orElseThrow(() -> new RuntimeException("Flight not found"));

    Airline airline = airlineRepository.findById(dto.getAirlineCode())
            .orElseThrow(() -> new RuntimeException("Airline not found"));

    Airport sourceAirport = airportRepository.findById(dto.getFromAirport())
            .orElseThrow(() -> new RuntimeException("Source Airport not found"));

    Airport destinationAirport = airportRepository.findById(dto.getToAirport())
            .orElseThrow(() -> new RuntimeException("Destination Airport not found"));

    modelMapper.map(dto, flight);

    flight.setAirline(airline);
    flight.setFromAirport(sourceAirport);
    flight.setToAirport(destinationAirport);

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

    FlightResponseDTO response =
            modelMapper.map(flight, FlightResponseDTO.class);

    response.setAirlineCode(
            flight.getAirline().getAirlineCode()
    );

    response.setAirlineName(
            flight.getAirline().getName()
    );

    response.setFromAirport(
            flight.getFromAirport().getAirportCode()
    );

    response.setToAirport(
            flight.getToAirport().getAirportCode()
    );

    return response;
}
//sorting method
private String getSortField(String sortBy) {

    if (sortBy == null || sortBy.isBlank()) {
        return "departureTs";
    }

    return switch (sortBy.toLowerCase()) {

        case "price" ->
                "basePrice";

        case "departuretime" ->
                "departureTs";

        case "arrivaltime" ->
                "arrivalTs";

        case "duration" ->
                "durationMins";

        default ->
                "departureTs";
    };

}
// for the admin panel to update the flight status
public FlightResponseDTO updateFlightStatus(
        Long flightId,
        FlightStatusRequestDTO request) {

    Flight flight = flightRepository.findById(flightId)
            .orElseThrow(() ->
                    new RuntimeException("Flight not found")
            );

    flight.setStatus(request.getStatus());

    Flight updatedFlight =
            flightRepository.save(flight);

    return convertToResponse(updatedFlight);
}
}