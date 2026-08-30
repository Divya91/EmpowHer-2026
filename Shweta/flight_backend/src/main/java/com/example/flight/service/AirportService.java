package com.example.flight.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.flight.dto.AirportRequestDTO;
import com.example.flight.dto.AirportResponseDTO;
import com.example.flight.entity.Airport;
import com.example.flight.repository.AirportRepository;
import org.modelmapper.ModelMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AirportService {

    private final AirportRepository airportRepository;

    private final ModelMapper modelMapper;


    // ================= ADD AIRPORT =================

    public AirportResponseDTO addAirport(
            AirportRequestDTO dto) {

        if (airportRepository.existsById(
                dto.getAirportCode())) {

            throw new RuntimeException(
                    "Airport already exists"
            );
        }

        Airport airport =
                modelMapper.map(dto, Airport.class);

        Airport savedAirport =
                airportRepository.save(airport);

        return modelMapper.map(
                savedAirport,
                AirportResponseDTO.class
        );
    }


    // ================= GET ALL AIRPORTS =================

    public List<AirportResponseDTO> getAllAirports() {

        return airportRepository.findAll()
                .stream()
                .map(airport ->
                        modelMapper.map(
                                airport,
                                AirportResponseDTO.class
                        )
                )
                .toList();
    }


    // ================= GET AIRPORT BY CODE =================

    public AirportResponseDTO getAirportByCode(
            String airportCode) {

        Airport airport =
                airportRepository.findById(airportCode)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Airport not found"
                                )
                        );

        return modelMapper.map(
                airport,
                AirportResponseDTO.class
        );
    }


    // ================= UPDATE AIRPORT =================

    public AirportResponseDTO updateAirport(
            String airportCode,
            AirportRequestDTO dto) {

        Airport airport =
                airportRepository.findById(airportCode)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Airport not found"
                                )
                        );

        /*
         * We don't change the airportCode here
         * because it is the primary key.
         */
        airport.setName(dto.getName());
        airport.setCity(dto.getCity());
        airport.setCountry(dto.getCountry());

        Airport updatedAirport =
                airportRepository.save(airport);

        return modelMapper.map(
                updatedAirport,
                AirportResponseDTO.class
        );
    }


    // ================= DELETE AIRPORT =================

    public void deleteAirport(
            String airportCode) {

        Airport airport =
                airportRepository.findById(airportCode)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Airport not found"
                                )
                        );

        airportRepository.delete(airport);
    }
}