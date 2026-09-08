package com.skyroute.repository;

import com.skyroute.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {

    @Query("SELECT f FROM Flight f WHERE f.originAirport.iataCode = :originIata " +
           "AND f.destinationAirport.iataCode = :destIata AND f.status = 'ACTIVE'")
    List<Flight> searchDirectFlights(@Param("originIata") String originIata, 
                                     @Param("destIata") String destIata);

    List<Flight> findByStatus(String status);
}
