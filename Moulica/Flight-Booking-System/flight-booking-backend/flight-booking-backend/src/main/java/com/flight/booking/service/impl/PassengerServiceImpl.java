package com.flight.booking.service.impl;

import com.flight.booking.dto.request.PassengerRequestDTO;
import com.flight.booking.dto.response.PassengerResponseDTO;
import com.flight.booking.entity.Passenger;
import com.flight.booking.mapper.PassengerMapper;
import com.flight.booking.repository.PassengerRepository;
import com.flight.booking.service.PassengerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PassengerServiceImpl implements PassengerService {

    private final PassengerRepository passengerRepository;
    private final PassengerMapper passengerMapper;

    @Override
    public PassengerResponseDTO createPassenger(PassengerRequestDTO dto) {

        Passenger passenger = passengerMapper.toEntity(dto);

        Passenger savedPassenger = passengerRepository.save(passenger);

        return passengerMapper.toResponseDTO(savedPassenger);
    }

    @Override
    public List<PassengerResponseDTO> getAllPassengers() {

        return passengerRepository.findAll()
                .stream()
                .map(passengerMapper::toResponseDTO)
                .toList();
    }

    @Override
    public PassengerResponseDTO getPassengerById(Long id) {

        Passenger passenger = passengerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Passenger not found"));

        return passengerMapper.toResponseDTO(passenger);
    }

    @Override
    public PassengerResponseDTO updatePassenger(Long id,
                                                PassengerRequestDTO dto) {

        Passenger passenger = passengerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Passenger not found"));

        passengerMapper.updateEntity(dto, passenger);

        Passenger updatedPassenger = passengerRepository.save(passenger);

        return passengerMapper.toResponseDTO(updatedPassenger);
    }

    @Override
    public void deletePassenger(Long id) {

        Passenger passenger = passengerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Passenger not found"));

        passengerRepository.delete(passenger);
    }
}