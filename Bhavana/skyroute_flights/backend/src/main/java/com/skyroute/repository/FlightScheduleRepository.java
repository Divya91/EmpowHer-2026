package com.skyroute.repository;

import com.skyroute.entity.FlightSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FlightScheduleRepository extends JpaRepository<FlightSchedule, Long> {

    @Query("SELECT s FROM FlightSchedule s JOIN s.flight f " +
           "WHERE f.originAirport.iataCode = :originIata " +
           "AND f.destinationAirport.iataCode = :destIata " +
           "AND s.scheduledDepartureDate = :travelDate " +
           "AND s.status = 'SCHEDULED'")
    List<FlightSchedule> searchSchedules(
            @Param("originIata") String originIata,
            @Param("destIata") String destIata,
            @Param("travelDate") LocalDate travelDate
    );

    Optional<FlightSchedule> findByFlightIdAndScheduledDepartureDate(Long flightId, LocalDate date);
}
