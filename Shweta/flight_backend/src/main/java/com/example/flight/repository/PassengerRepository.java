package com.example.flight.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.flight.entity.Passengers;

@Repository
public interface PassengerRepository extends JpaRepository<Passengers, Long> {

    @Query("SELECT p FROM Passengers p WHERE LOWER(p.firstName) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(p.lastName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Passengers> findByNameContainingIgnoreCase(@Param("name") String name);
}