package com.flight.booking.mapper;

import com.flight.booking.dto.request.PassengerRequestDTO;
import com.flight.booking.dto.response.PassengerResponseDTO;
import com.flight.booking.entity.Passenger;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PassengerMapper {

    private final ModelMapper modelMapper;

    // Convert RequestDTO -> Entity
    public Passenger toEntity(PassengerRequestDTO dto) {
        return modelMapper.map(dto, Passenger.class);
    }

    // Convert Entity -> ResponseDTO
    public PassengerResponseDTO toResponseDTO(Passenger passenger) {
        return modelMapper.map(passenger, PassengerResponseDTO.class);
    }

    // Update existing entity using RequestDTO
    public void updateEntity(PassengerRequestDTO dto, Passenger passenger) {
        modelMapper.map(dto, passenger);
    }
}