package com.example.flight.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.flight.entity.Flight;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {

    // Search  a flights by source and destination
    List<Flight> findBySourceAndDestination(String source, String destination);

}