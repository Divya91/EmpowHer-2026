package com.example.flight.service;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.flight.dto.PassengerRequestDTO;
import com.example.flight.dto.PassengerResponseDTO;
import com.example.flight.exception.ResourceNotFoundException;
import com.example.flight.repository.*;
import com.example.flight.entity.Passengers;

@Service
public class PassengerService {

    @Autowired
    private PassengerRepository passengerRepository;

    @Autowired
    private ModelMapper modelMapper;

    public PassengerResponseDTO savePassenger(PassengerRequestDTO passengerRequestDTO) {
        Passengers passenger = modelMapper.map(passengerRequestDTO, Passengers.class);
        Passengers savedPassenger = passengerRepository.save(passenger);
        return modelMapper.map(savedPassenger, PassengerResponseDTO.class);
    }

    public Optional<Passengers> getPassengerById(Long id) {
        return passengerRepository.findById(id);
    }

    public void deletePassenger(Long id) {
        if (!passengerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Passenger not found with id: " + id);
        }

        passengerRepository.deleteById(id);
    }

    public List<PassengerResponseDTO> getAllPassengers() {
        return passengerRepository.findAll()
                .stream()
                .map(passenger -> modelMapper.map(passenger, PassengerResponseDTO.class))
                .toList();
    }

    public List<PassengerResponseDTO> getPassengersByName(String name) {
        return passengerRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(passenger -> modelMapper.map(passenger, PassengerResponseDTO.class))
                .toList();
    }

    public PassengerResponseDTO getPassengerDTOById(Long id) {
        Passengers passenger = passengerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Passenger not found with id: " + id));

        return modelMapper.map(passenger, PassengerResponseDTO.class);
    }
}
