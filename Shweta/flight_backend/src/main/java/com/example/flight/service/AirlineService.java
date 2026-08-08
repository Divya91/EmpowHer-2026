package com.example.flight.service;

import com.example.flight.dto.AirlineRequestDTO;
import com.example.flight.dto.AirlineResponseDTO;
import com.example.flight.entity.Airline;
import com.example.flight.repository.AirlineRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AirlineService {

    private final AirlineRepository airlineRepository;
    private final ModelMapper modelMapper;

    // Get All Airlines
    public List<AirlineResponseDTO> getAllAirlines() {

        return airlineRepository.findAll()
                .stream()
                .map(airline ->
                        modelMapper.map(airline, AirlineResponseDTO.class))
                .toList();
    }

    // Get Airline By Code
    public AirlineResponseDTO getAirlineByCode(String airlineCode) {

        Airline airline = airlineRepository.findById(airlineCode)
                .orElseThrow(() ->
                        new RuntimeException("Airline not found"));

        return modelMapper.map(airline, AirlineResponseDTO.class);
    }

    // Add Airline
    public AirlineResponseDTO addAirline(AirlineRequestDTO dto) {

        if (airlineRepository.existsById(dto.getAirlineCode())) {
            throw new RuntimeException("Airline already exists");
        }

        Airline airline = modelMapper.map(dto, Airline.class);

        Airline savedAirline = airlineRepository.save(airline);

        return modelMapper.map(savedAirline, AirlineResponseDTO.class);
    }

    // Update Airline
    public AirlineResponseDTO updateAirline(String airlineCode,
                                            AirlineRequestDTO dto) {

        Airline airline = airlineRepository.findById(airlineCode)
                .orElseThrow(() ->
                        new RuntimeException("Airline not found"));

        airline.setName(dto.getName());

        Airline updatedAirline = airlineRepository.save(airline);

        return modelMapper.map(updatedAirline,
                AirlineResponseDTO.class);
    }

    // Delete Airline
    public void deleteAirline(String airlineCode) {

        Airline airline = airlineRepository.findById(airlineCode)
                .orElseThrow(() ->
                        new RuntimeException("Airline not found"));

        airlineRepository.delete(airline);
    }
}