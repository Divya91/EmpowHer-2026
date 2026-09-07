package com.flightbooking.repository;

import com.flightbooking.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {

    Optional<Flight> findByFlightNumber(String flightNumber);

    @Query("SELECT f FROM Flight f WHERE " +
           "LOWER(f.origin) = LOWER(:origin) AND " +
           "LOWER(f.destination) = LOWER(:destination) AND " +
           "f.departureTime >= :startOfDay AND " +
           "f.departureTime < :endOfDay AND " +
           "f.availableSeats >= :requiredSeats AND " +
           "f.status = 'SCHEDULED'")
    List<Flight> searchFlights(
            @Param("origin") String origin,
            @Param("destination") String destination,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay,
            @Param("requiredSeats") int requiredSeats
    );

    boolean existsByFlightNumber(String flightNumber);
}
