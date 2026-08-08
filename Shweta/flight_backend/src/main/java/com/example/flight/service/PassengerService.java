package com.example.flight.service;


import com.example.flight.dto.PassengerRequestDTO;
import com.example.flight.dto.PassengerResponseDTO;
import com.example.flight.entity.Booking;
import com.example.flight.entity.Passenger;
import com.example.flight.repository.BookingRepository;
import com.example.flight.repository.PassengerRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PassengerService {

    private final PassengerRepository passengerRepository;
    private final BookingRepository bookingRepository;
    private final ModelMapper modelMapper;

    // Get all passengers
    public List<PassengerResponseDTO> getAllPassengers() {

        return passengerRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Get passenger by ID
    public PassengerResponseDTO getPassengerById(
            Long passengerId) {

        Passenger passenger =
                passengerRepository.findById(passengerId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Passenger not found with ID: "
                                                + passengerId
                                ));

        return convertToResponse(passenger);
    }

    // Get passengers by booking ID
    public List<PassengerResponseDTO> getPassengersByBooking(
            Long bookingId) {

        if (!bookingRepository.existsById(bookingId)) {
            throw new RuntimeException(
                    "Booking not found with ID: " + bookingId
            );
        }

        return passengerRepository
                .findByBookingBookingId(bookingId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Add passenger
    public PassengerResponseDTO addPassenger(
            PassengerRequestDTO dto) {

        Booking booking =
                bookingRepository.findById(dto.getBookingId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Booking not found with ID: "
                                                + dto.getBookingId()
                                ));

        Passenger passenger =
                modelMapper.map(dto, Passenger.class);

        passenger.setBooking(booking);

        Passenger savedPassenger =
                passengerRepository.save(passenger);

        return convertToResponse(savedPassenger);
    }

    // Update passenger
    public PassengerResponseDTO updatePassenger(
            Long passengerId,
            PassengerRequestDTO dto) {

        Passenger passenger =
                passengerRepository.findById(passengerId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Passenger not found with ID: "
                                                + passengerId
                                ));

        Booking booking =
                bookingRepository.findById(dto.getBookingId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Booking not found with ID: "
                                                + dto.getBookingId()
                                ));

        modelMapper.map(dto, passenger);

        passenger.setBooking(booking);

        Passenger updatedPassenger =
                passengerRepository.save(passenger);

        return convertToResponse(updatedPassenger);
    }

    // Delete passenger
    public void deletePassenger(Long passengerId) {

        Passenger passenger =
                passengerRepository.findById(passengerId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Passenger not found with ID: "
                                                + passengerId
                                ));

        passengerRepository.delete(passenger);
    }

    // Entity → Response DTO
    private PassengerResponseDTO convertToResponse(
            Passenger passenger) {

        PassengerResponseDTO response =
                modelMapper.map(
                        passenger,
                        PassengerResponseDTO.class
                );

        response.setBookingId(
                passenger.getBooking().getBookingId()
        );

        return response;
    }
}