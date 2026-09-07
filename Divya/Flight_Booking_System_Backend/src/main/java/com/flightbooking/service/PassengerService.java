package com.flightbooking.service;

import com.flightbooking.entity.Passenger;

import java.util.List;

public interface PassengerService {

    Passenger addPassenger(Passenger passenger);

    Passenger getPassengerById(Long passengerId);

    List<Passenger> getAllPassengers();

    List<Passenger> getPassengersByBookingId(Long bookingId);

    Passenger updatePassenger(Long passengerId, Passenger passenger);

    void deletePassenger(Long passengerId);
}