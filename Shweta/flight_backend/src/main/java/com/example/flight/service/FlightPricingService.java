package com.example.flight.service;


import com.example.flight.dto.FlightPricingRequestDTO;
import com.example.flight.dto.FlightPricingResponseDTO;
import com.example.flight.entity.Flight;
import com.example.flight.entity.FlightPricing;
import com.example.flight.repository.FlightPricingRepository;
import com.example.flight.repository.FlightRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FlightPricingService {

    private final FlightPricingRepository flightPricingRepository;
    private final FlightRepository flightRepository;
    private final ModelMapper modelMapper;

    // Get all pricing
    public List<FlightPricingResponseDTO> getAllPricing() {

        return flightPricingRepository.findAll()
                .stream()
                .map(pricing ->
                        modelMapper.map(
                                pricing,
                                FlightPricingResponseDTO.class
                        ))
                .toList();
    }

    // Get pricing by ID
    public FlightPricingResponseDTO getPricingById(Long pricingId) {

        FlightPricing pricing = flightPricingRepository.findById(pricingId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Flight pricing not found with ID: "
                                        + pricingId
                        ));

        return modelMapper.map(
                pricing,
                FlightPricingResponseDTO.class
        );
    }

    // Get pricing by Flight ID
    public List<FlightPricingResponseDTO> getPricingByFlightId(
            Long flightId) {

        if (!flightRepository.existsById(flightId)) {
            throw new RuntimeException(
                    "Flight not found with ID: " + flightId
            );
        }

        return flightPricingRepository
                .findByFlightFlightId(flightId)
                .stream()
                .map(pricing ->
                        modelMapper.map(
                                pricing,
                                FlightPricingResponseDTO.class
                        ))
                .toList();
    }

    // Add pricing
    public FlightPricingResponseDTO addPricing(
            FlightPricingRequestDTO dto) {

        Flight flight = flightRepository.findById(dto.getFlightId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Flight not found with ID: "
                                        + dto.getFlightId()
                        ));

        // DTO -> Entity
        FlightPricing pricing =
                modelMapper.map(dto, FlightPricing.class);

        // Set relationship
        pricing.setFlight(flight);

        // Set created time
        pricing.setCreatedAt(LocalDateTime.now());

        FlightPricing savedPricing =
                flightPricingRepository.save(pricing);

        // Entity -> DTO
        return modelMapper.map(
                savedPricing,
                FlightPricingResponseDTO.class
        );
    }

    // Update pricing
    public FlightPricingResponseDTO updatePricing(
            Long pricingId,
            FlightPricingRequestDTO dto) {

        FlightPricing pricing =
                flightPricingRepository.findById(pricingId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Flight pricing not found with ID: "
                                                + pricingId
                                ));

        Flight flight = flightRepository.findById(dto.getFlightId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Flight not found with ID: "
                                        + dto.getFlightId()
                        ));

        // DTO -> existing Entity
        modelMapper.map(dto, pricing);

        // Set relationship
        pricing.setFlight(flight);

        FlightPricing updatedPricing =
                flightPricingRepository.save(pricing);

        // Entity -> DTO
        return modelMapper.map(
                updatedPricing,
                FlightPricingResponseDTO.class
        );
    }

    // Delete pricing
    public void deletePricing(Long pricingId) {

        FlightPricing pricing =
                flightPricingRepository.findById(pricingId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Flight pricing not found with ID: "
                                                + pricingId
                                ));

        flightPricingRepository.delete(pricing);
    }
}