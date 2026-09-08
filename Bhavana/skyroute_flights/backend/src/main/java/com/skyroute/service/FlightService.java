package com.skyroute.service;

import com.skyroute.dto.flight.FlightResponseDto;
import com.skyroute.dto.flight.FlightSearchCriteria;
import com.skyroute.dto.flight.SeatDto;
import com.skyroute.entity.Flight;
import com.skyroute.entity.FlightSchedule;
import com.skyroute.entity.FlightSeat;
import com.skyroute.exception.ResourceNotFoundException;
import com.skyroute.repository.AirportRepository;
import com.skyroute.repository.FlightRepository;
import com.skyroute.repository.FlightScheduleRepository;
import com.skyroute.repository.FlightSeatRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FlightService {

    private final FlightRepository flightRepository;
    private final FlightScheduleRepository scheduleRepository;
    private final FlightSeatRepository seatRepository;
    private final AirportRepository airportRepository;

    @Transactional
    public List<FlightResponseDto> searchFlights(FlightSearchCriteria criteria) {
        log.info("Searching flights from {} to {} on {}", criteria.getOrigin(), criteria.getDestination(), criteria.getDepartureDate());

        List<FlightSchedule> schedules = scheduleRepository.searchSchedules(
                criteria.getOrigin().toUpperCase(),
                criteria.getDestination().toUpperCase(),
                criteria.getDepartureDate()
        );

        // If no pre-generated schedule exists for the date, generate dynamic schedule for direct active flights
        if (schedules.isEmpty()) {
            List<Flight> matchingFlights = flightRepository.searchDirectFlights(
                    criteria.getOrigin().toUpperCase(),
                    criteria.getDestination().toUpperCase()
            );

            for (Flight flight : matchingFlights) {
                FlightSchedule newSchedule = createScheduleForDate(flight, criteria.getDepartureDate());
                schedules.add(newSchedule);
            }
        }

        return schedules.stream()
                .map(this::mapToDto)
                .filter(dto -> criteria.getMaxPrice() == null || dto.getTotalPrice().doubleValue() <= criteria.getMaxPrice())
                .filter(dto -> criteria.getAirlineCode() == null || dto.getAirlineCode().equalsIgnoreCase(criteria.getAirlineCode()))
                .filter(dto -> criteria.getNonStopOnly() == null || !criteria.getNonStopOnly() || dto.getStops() == 0)
                .collect(Collectors.toList());
    }

    public FlightResponseDto getFlightDetails(Long scheduleId) {
        FlightSchedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Flight schedule not found for ID: " + scheduleId));
        return mapToDto(schedule);
    }

    public List<SeatDto> getSeatMap(Long scheduleId) {
        List<FlightSeat> seats = seatRepository.findByScheduleIdOrderBySeatNumberAsc(scheduleId);
        if (seats.isEmpty()) {
            // Generate standard Airbus A320 seat layout (Rows 1-30, A-F)
            seats = generateSeatInventory(scheduleId);
        }

        return seats.stream().map(s -> SeatDto.builder()
                .id(s.getId())
                .seatNumber(s.getSeatNumber())
                .cabinClass(s.getCabinClass())
                .seatType(s.getSeatType())
                .priceSurcharge(s.getPriceSurcharge())
                .isBooked(s.getIsBooked())
                .isBlocked(s.getIsBlocked())
                .build()
        ).collect(Collectors.toList());
    }

    private FlightSchedule createScheduleForDate(Flight flight, LocalDate date) {
        LocalDateTime departureTime = LocalDateTime.of(date, flight.getDepartureTime());
        LocalDateTime arrivalTime = departureTime.plusMinutes(flight.getDurationMinutes());

        FlightSchedule schedule = FlightSchedule.builder()
                .flight(flight)
                .scheduledDepartureDate(date)
                .departureDatetime(departureTime)
                .arrivalDatetime(arrivalTime)
                .availableEconomySeats(150)
                .availableBusinessSeats(12)
                .currentEconomyPrice(flight.getBaseFare().add(flight.getTaxAmount()))
                .currentBusinessPrice(flight.getBaseFare().multiply(BigDecimal.valueOf(2.4)))
                .status("SCHEDULED")
                .build();

        return scheduleRepository.save(schedule);
    }

    private List<FlightSeat> generateSeatInventory(Long scheduleId) {
        FlightSchedule schedule = scheduleRepository.findById(scheduleId).orElseThrow();
        List<FlightSeat> seats = new ArrayList<>();
        String[] cols = {"A", "B", "C", "D", "E", "F"};

        for (int r = 1; r <= 30; r++) {
            for (String col : cols) {
                String seatNum = r + col;
                String seatType = (col.equals("A") || col.equals("F")) ? "WINDOW" :
                                  (col.equals("C") || col.equals("D")) ? "AISLE" : "MIDDLE";
                String cabinClass = (r <= 3) ? "BUSINESS" : (r <= 6) ? "PREMIUM_ECONOMY" : "ECONOMY";
                BigDecimal surcharge = (r <= 3) ? BigDecimal.valueOf(1500) : (r == 12 || r == 13) ? BigDecimal.valueOf(600) : (seatType.equals("WINDOW") || seatType.equals("AISLE")) ? BigDecimal.valueOf(250) : BigDecimal.ZERO;
                
                boolean isBooked = (r % 4 == 0 && (col.equals("A") || col.equals("D"))); // realistic occupied seats

                seats.add(FlightSeat.builder()
                        .schedule(schedule)
                        .seatNumber(seatNum)
                        .cabinClass(cabinClass)
                        .seatType((r == 12 || r == 13) ? "EMERGENCY_EXIT" : seatType)
                        .priceSurcharge(surcharge)
                        .isBooked(isBooked)
                        .build());
            }
        }
        return seatRepository.saveAll(seats);
    }

    private FlightResponseDto mapToDto(FlightSchedule s) {
        Flight f = s.getFlight();
        BigDecimal total = f.getBaseFare().add(f.getTaxAmount());

        return FlightResponseDto.builder()
                .id(f.getId())
                .scheduleId(s.getId())
                .flightNumber(f.getFlightNumber())
                .airlineName(f.getAirline().getName())
                .airlineCode(f.getAirline().getIataCode())
                .airlineLogo(f.getAirline().getLogoUrl())
                .originIata(f.getOriginAirport().getIataCode())
                .originCity(f.getOriginAirport().getCity())
                .originAirportName(f.getOriginAirport().getName())
                .destinationIata(f.getDestinationAirport().getIataCode())
                .destinationCity(f.getDestinationAirport().getCity())
                .destinationAirportName(f.getDestinationAirport().getName())
                .departureTime(f.getDepartureTime())
                .arrivalTime(f.getArrivalTime())
                .travelDate(s.getScheduledDepartureDate())
                .departureDateTime(s.getDepartureDatetime())
                .arrivalDateTime(s.getArrivalDatetime())
                .durationMinutes(f.getDurationMinutes())
                .stops(f.getStopsCount())
                .baseFare(f.getBaseFare())
                .taxAmount(f.getTaxAmount())
                .totalPrice(total)
                .isRefundable(f.getIsRefundable())
                .cabinBaggageKg(f.getBaggageCabinKg())
                .checkinBaggageKg(f.getBaggageCheckinKg())
                .availableSeats(s.getAvailableEconomySeats())
                .aircraftModel("Airbus A320neo")
                .cabinClass("ECONOMY")
                .build();
    }
}
