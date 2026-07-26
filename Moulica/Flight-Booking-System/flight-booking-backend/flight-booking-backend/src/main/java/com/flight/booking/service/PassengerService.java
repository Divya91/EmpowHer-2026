package com.flight.booking.service;

import com.flight.booking.dto.request.PassengerRequestDTO;
import com.flight.booking.dto.response.PassengerResponseDTO;

import java.util.List;

public interface PassengerService {

    PassengerResponseDTO createPassenger(PassengerRequestDTO dto);

    List<PassengerResponseDTO> getAllPassengers();

    PassengerResponseDTO getPassengerById(Long id);

    PassengerResponseDTO updatePassenger(
            Long id,
            PassengerRequestDTO dto
    );

    void deletePassenger(Long id);
}