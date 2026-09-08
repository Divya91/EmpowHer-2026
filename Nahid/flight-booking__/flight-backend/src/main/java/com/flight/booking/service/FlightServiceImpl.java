package com.flight.booking.service;

import com.flight.booking.dto.request.FlightRequestDTO;
import com.flight.booking.dto.response.FlightResponseDTO;
import com.flight.booking.entity.Flight;
import com.flight.booking.mapper.FlightMapper;
import com.flight.booking.repository.FlightRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.math.BigDecimal;
import com.flight.booking.dto.search.FlightSearchCriteria;
import com.flight.booking.specification.FlightSpecification;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FlightServiceImpl {

    private final FlightRepository repository;
    private final FlightMapper mapper;

    public FlightResponseDTO createFlight(FlightRequestDTO dto) {

        Flight flight = mapper.toEntity(dto);

        Flight savedFlight = repository.save(flight);

        return mapper.toResponseDTO(savedFlight);
    }

    public List<FlightResponseDTO> getAllFlights() {

        return repository.findAll()
                .stream()
                .map(mapper::toResponseDTO)
                .toList();
    }

    public FlightResponseDTO getFlightById(Long id) {

        Flight flight = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Flight not found"));

        return mapper.toResponseDTO(flight);
    }

    public FlightResponseDTO updateFlight(Long id, FlightRequestDTO dto) {

        Flight existingFlight = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Flight not found"));

        mapper.updateEntity(dto, existingFlight);

        Flight updatedFlight = repository.save(existingFlight);

        return mapper.toResponseDTO(updatedFlight);
    }

    public void deleteFlight(Long id) {
        repository.deleteById(id);
    }

    public Page<FlightResponseDTO> searchFlights(

            FlightSearchCriteria criteria,

            Pageable pageable

    ) {

        Specification<Flight> specification =
                FlightSpecification.searchFlights(criteria);

        return repository
                .findAll(specification, pageable)
                .map(mapper::toResponseDTO);

    }
}