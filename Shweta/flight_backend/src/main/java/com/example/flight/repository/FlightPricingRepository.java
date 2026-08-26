package com.example.flight.repository;


import com.example.flight.entity.FlightPricing;
import com.example.flight.entity.CabinClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FlightPricingRepository
        extends JpaRepository<FlightPricing, Long> {

    Optional<FlightPricing>
    findByFlightFlightIdAndSeatClass(
            Long flightId,
            CabinClass seatClass
    );
}