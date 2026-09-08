package com.example.flight.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.flight.dto.AirlineRequestDTO;
import com.example.flight.dto.AirlineResponseDTO;
import com.example.flight.entity.Airline;
import com.example.flight.repository.AirlineRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AirlineService {

    private final AirlineRepository airlineRepository;

    private final ModelMapper modelMapper;


    // ================= ADD AIRLINE =================

    public AirlineResponseDTO addAirline(
            AirlineRequestDTO request) {

        if (airlineRepository.existsById(
                request.getAirlineCode())) {

            throw new RuntimeException(
                    "Airline already exists with code: "
                            + request.getAirlineCode()
            );
        }

        Airline airline =
                modelMapper.map(
                        request,
                        Airline.class
                );

        Airline savedAirline =
                airlineRepository.save(airline);

        return modelMapper.map(
                savedAirline,
                AirlineResponseDTO.class
        );
    }


    // ================= GET ALL AIRLINES =================

    @Transactional(readOnly = true)
    public List<AirlineResponseDTO> getAllAirlines() {

        return airlineRepository.findAll()
                .stream()
                .map(airline ->
                        modelMapper.map(
                                airline,
                                AirlineResponseDTO.class
                        )
                )
                .toList();
    }


    // ================= GET AIRLINE =================

    @Transactional(readOnly = true)
    public AirlineResponseDTO getAirlineByCode(
            String airlineCode) {

        Airline airline =
                airlineRepository.findById(airlineCode)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Airline not found with code: "
                                                + airlineCode
                                )
                        );

        return modelMapper.map(
                airline,
                AirlineResponseDTO.class
        );
    }


    // ================= UPDATE AIRLINE =================

    public AirlineResponseDTO updateAirline(
            String airlineCode,
            AirlineRequestDTO request) {

        Airline airline =
                airlineRepository.findById(airlineCode)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Airline not found with code: "
                                                + airlineCode
                                )
                        );

        /*
         * Airline code is the primary key.
         * Therefore, we don't change it during update.
         */
        airline.setName(request.getName());

        Airline updatedAirline =
                airlineRepository.save(airline);

        return modelMapper.map(
                updatedAirline,
                AirlineResponseDTO.class
        );
    }


    // ================= DELETE AIRLINE =================

    public void deleteAirline(
            String airlineCode) {

        Airline airline =
                airlineRepository.findById(airlineCode)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Airline not found with code: "
                                                + airlineCode
                                )
                        );

        airlineRepository.delete(airline);
    }
}