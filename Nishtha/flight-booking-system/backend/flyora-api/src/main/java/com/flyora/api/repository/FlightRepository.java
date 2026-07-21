package com.flyora.api.repository;

import com.flyora.api.entity.Flight;
import com.flyora.api.enums.CabinClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface FlightRepository extends JpaRepository<Flight, Long> {

    List<Flight> findByFromAirportIgnoreCaseAndToAirportIgnoreCaseAndTravelDateAndCabinClass(
            String fromAirport,
            String toAirport,
            LocalDate travelDate,
            CabinClass cabinClass
    );

    @Query("SELECT DISTINCT f.fromAirport FROM Flight f ORDER BY f.fromAirport")
    List<String> findDistinctSourceAirports();

    @Query("SELECT DISTINCT f.toAirport FROM Flight f ORDER BY f.toAirport")
    List<String> findDistinctDestinationAirports();

    @Query("SELECT DISTINCT f.airline FROM Flight f ORDER BY f.airline")
    List<String> findDistinctAirlines();

    @Query("""
SELECT DISTINCT CONCAT(f.fromAirport, ' → ', f.toAirport)
FROM Flight f
""")
List<String> findDistinctRoutes();
}