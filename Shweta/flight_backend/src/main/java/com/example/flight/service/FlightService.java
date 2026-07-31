package com.example.flight.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.flight.dto.FlightRequestDTO;
import com.example.flight.dto.FlightResponseDTO;
import com.example.flight.entity.Flight;
import com.example.flight.repository.FlightRepository;

@Service
public class FlightService {

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private ModelMapper modelMapper;

    // Add a new flight
    public FlightResponseDTO addFlight(FlightRequestDTO flightRequestDTO) {
        Flight flight = modelMapper.map(flightRequestDTO, Flight.class);
        Flight savedFlight = flightRepository.save(flight);
        return modelMapper.map(savedFlight, FlightResponseDTO.class);
    }

    // Get all flights
    public List<FlightResponseDTO> getAllFlights() {
        return flightRepository.findAll()
                .stream()
                .map(flight -> modelMapper.map(flight, FlightResponseDTO.class))
                .toList();
    }

    // Search flights by source and destination
    public List<FlightResponseDTO> searchFlights(String source, String destination) {
        return flightRepository.findBySourceAndDestination(source, destination)
                .stream()
                .map(flight -> modelMapper.map(flight, FlightResponseDTO.class))
                .toList();
    }
}
