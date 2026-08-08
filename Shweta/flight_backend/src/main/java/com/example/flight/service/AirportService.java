package com.example.flight.service;

import com.example.flight.dto.AirportRequestDTO;
import com.example.flight.dto.AirportResponseDTO;
import com.example.flight.entity.Airport;
import com.example.flight.repository.AirportRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AirportService {

    private final AirportRepository airportRepository;
    private final ModelMapper modelMapper;

    // Get all airports
    public List<AirportResponseDTO> getAllAirports() {

        return airportRepository.findAll()
                .stream()
                .map(airport -> modelMapper.map(airport, AirportResponseDTO.class))
                .toList();
    }

    // Get airport by airport code
    public AirportResponseDTO getAirportByCode(String airportCode) {

        Airport airport = airportRepository.findById(airportCode)
                .orElseThrow(() -> new RuntimeException("Airport not found with code: " + airportCode));

        return modelMapper.map(airport, AirportResponseDTO.class);
    }

    // Add new airport
    public AirportResponseDTO addAirport(AirportRequestDTO airportRequestDTO) {

        if (airportRepository.existsById(airportRequestDTO.getAirportCode())) {
            throw new RuntimeException("Airport already exists with code: "
                    + airportRequestDTO.getAirportCode());
        }

        Airport airport = modelMapper.map(airportRequestDTO, Airport.class);

        Airport savedAirport = airportRepository.save(airport);

        return modelMapper.map(savedAirport, AirportResponseDTO.class);
    }

    // Update airport
    public AirportResponseDTO updateAirport(String airportCode,
                                            AirportRequestDTO airportRequestDTO) {

        Airport airport = airportRepository.findById(airportCode)
                .orElseThrow(() -> new RuntimeException("Airport not found with code: " + airportCode));

        airport.setName(airportRequestDTO.getName());
        airport.setCity(airportRequestDTO.getCity());
        airport.setCountry(airportRequestDTO.getCountry());

        Airport updatedAirport = airportRepository.save(airport);

        return modelMapper.map(updatedAirport, AirportResponseDTO.class);
    }

    // Delete airport
    public void deleteAirport(String airportCode) {

        Airport airport = airportRepository.findById(airportCode)
                .orElseThrow(() -> new RuntimeException("Airport not found with code: " + airportCode));

        airportRepository.delete(airport);
    }
}