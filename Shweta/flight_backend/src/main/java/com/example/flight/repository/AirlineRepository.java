package com.example.flight.repository;

import com.example.flight.entity.Airline;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AirlineRepository extends JpaRepository<Airline, String> {

}