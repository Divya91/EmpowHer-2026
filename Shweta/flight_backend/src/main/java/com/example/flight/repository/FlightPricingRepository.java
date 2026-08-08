package com.example.flight.repository;


import com.example.flight.entity.FlightPricing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlightPricingRepository
        extends JpaRepository<FlightPricing, Long> {

    List<FlightPricing> findByFlightFlightId(Long flightId);
}