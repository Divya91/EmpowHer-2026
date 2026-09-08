package com.skyroute.repository;

import com.skyroute.entity.FlightSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlightSeatRepository extends JpaRepository<FlightSeat, Long> {
    List<FlightSeat> findByScheduleIdOrderBySeatNumberAsc(Long scheduleId);
    Optional<FlightSeat> findByScheduleIdAndSeatNumber(Long scheduleId, String seatNumber);
}
