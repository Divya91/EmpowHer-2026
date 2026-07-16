package com.flight.booking.mapper;

import com.flight.booking.dto.request.FlightRequestDTO;
import com.flight.booking.dto.response.FlightResponseDTO;
import com.flight.booking.entity.Airline;
import com.flight.booking.entity.Airport;
import com.flight.booking.entity.Flight;
import com.flight.booking.repository.AirlineRepository;
import com.flight.booking.repository.AirportRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FlightMapper {

    public Flight toEntity(FlightRequestDTO dto) {

        Flight flight = modelMapper.map(dto, Flight.class);

        Airline airline = airlineRepository.findById(dto.getAirlineCode())
                .orElseThrow(() -> new RuntimeException("Airline not found"));

        Airport fromAirport = airportRepository.findById(dto.getFromAirport())
                .orElseThrow(() -> new RuntimeException("Source airport not found"));

        Airport toAirport = airportRepository.findById(dto.getToAirport())
                .orElseThrow(() -> new RuntimeException("Destination airport not found"));

        flight.setAirline(airline);
        flight.setFromAirport(fromAirport);
        flight.setToAirport(toAirport);

        return flight;
    }

    public FlightResponseDTO toResponseDTO(Flight flight) {

        FlightResponseDTO dto = modelMapper.map(flight, FlightResponseDTO.class);

        dto.setAirlineCode(flight.getAirline().getAirlineCode());
        dto.setAirlineName(flight.getAirline().getName());

        dto.setFromAirport(flight.getFromAirport().getAirportCode());
        dto.setToAirport(flight.getToAirport().getAirportCode());

        return dto;
    }

    public void updateEntity(FlightRequestDTO dto, Flight flight) {

        Airline airline = airlineRepository.findById(dto.getAirlineCode())
                .orElseThrow(() -> new RuntimeException("Airline not found"));

        Airport fromAirport = airportRepository.findById(dto.getFromAirport())
                .orElseThrow(() -> new RuntimeException("Source airport not found"));

        Airport toAirport = airportRepository.findById(dto.getToAirport())
                .orElseThrow(() -> new RuntimeException("Destination airport not found"));

        flight.setAirline(airline);
        flight.setFromAirport(fromAirport);
        flight.setToAirport(toAirport);

        flight.setDepartureTime(dto.getDepartureTime());
        flight.setArrivalTime(dto.getArrivalTime());
        flight.setStops(dto.getStops());
        flight.setBasePrice(dto.getBasePrice());
        flight.setAvailableSeats(dto.getAvailableSeats());
        flight.setDurationMinutes(dto.getDurationMinutes());
    }

    private final ModelMapper modelMapper;

    private final AirlineRepository airlineRepository;

    private final AirportRepository airportRepository;

}