// package com.ticket.booking.service;

// import java.time.LocalDate;
// import java.util.List;
// import org.springframework.stereotype.Service;
// import com.ticket.booking.exception.ApiException;
// import com.ticket.booking.dto.FlightResponse;
// import com.ticket.booking.entity.Flight;
// import com.ticket.booking.repository.FlightRepository;

// import lombok.RequiredArgsConstructor;

// @Service
// @RequiredArgsConstructor
// public class FlightService {
//     private final FlightRepository flightRepository;

//     public List<FlightResponse> searchFlights(String fromAirport, String toAirport, LocalDate date) {
//         List<Flight> flights = (fromAirport == null || toAirport == null)
//                 ? flightRepository.findAll()
//                 : flightRepository.findByFromAirportIgnoreCaseAndToAirportIgnoreCase(fromAirport, toAirport);

//         return flights.stream().filter(f -> date == null || f.getDepartureTs().toLocalDate().isEqual(date))
//                 .map(this::toResponse)
//                 .toList();
//     }

//     public Flight getFlightOrThrow(String flightId) {
//         return flightRepository.findById(flightId).orElseThrow(() -> new ApiException("Flight not found: " + flightId));
//     }

//     public void reserveSeats(Flight flight, int seats) {
//         if (flight.getSeatsLeft() < seats) {
//             throw new ApiException("Only " + flight.getSeatsLeft() + " seat(s) left on this flight");
//         }
//         flight.setSeatsLeft(flight.getSeatsLeft() - seats);
//         flightRepository.save(flight);
//     }

//     private FlightResponse toResponse(Flight f) {
//         return FlightResponse.builder()
//                 .flightId(f.getFlightId())
//                 .flightNumber(f.getFlightNumber())
//                 .airlineCode(f.getAirlineCode())
//                 .airlineName(f.getAirlineName())
//                 .fromAirport(f.getFromAirport())
//                 .toAirport(f.getToAirport())
//                 .departureTs(f.getDepartureTs())
//                 .arrivalTs(f.getArrivalTs())
//                 .stops(f.getStops())
//                 .durationMins(f.getDurationMins())
//                 .basePrice(f.getBasePrice())
//                 .aircraft(f.getAircraft())
//                 .seatsLeft(f.getSeatsLeft())
//                 .build();
//     }
// }

package com.ticket.booking.service;

import com.ticket.booking.dto.FlightResponse;
import com.ticket.booking.entity.Flight;
import com.ticket.booking.exception.ApiException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class FlightService {

    private final List<Flight> flights = new ArrayList<>();

    public FlightService() {

        flights.add(
                Flight.builder()
                        .flightId("F101")
                        .flightNumber("AI101")
                        .airlineCode("AI")
                        .airlineName("Air India")
                        .fromAirport("DEL")
                        .toAirport("BLR")
                        .departureTs(LocalDateTime.of(2026, 7, 20, 10, 30))
                        .arrivalTs(LocalDateTime.of(2026, 7, 20, 13, 0))
                        .stops(0)
                        .durationMins(150)
                        .basePrice(new BigDecimal("5500"))
                        .aircraft("Airbus A320")
                        .seatsLeft(120)
                        .build());

        flights.add(
                Flight.builder()
                        .flightId("F102")
                        .flightNumber("6E201")
                        .airlineCode("6E")
                        .airlineName("IndiGo")
                        .fromAirport("DEL")
                        .toAirport("BOM")
                        .departureTs(LocalDateTime.of(2026, 7, 20, 12, 15))
                        .arrivalTs(LocalDateTime.of(2026, 7, 20, 14, 25))
                        .stops(0)
                        .durationMins(130)
                        .basePrice(new BigDecimal("4800"))
                        .aircraft("Airbus A321")
                        .seatsLeft(95)
                        .build());

        flights.add(
                Flight.builder()
                        .flightId("F103")
                        .flightNumber("UK811")
                        .airlineCode("UK")
                        .airlineName("Vistara")
                        .fromAirport("DEL")
                        .toAirport("HYD")
                        .departureTs(LocalDateTime.of(2026, 7, 21, 9, 0))
                        .arrivalTs(LocalDateTime.of(2026, 7, 21, 11, 20))
                        .stops(0)
                        .durationMins(140)
                        .basePrice(new BigDecimal("6200"))
                        .aircraft("Boeing 737")
                        .seatsLeft(40)
                        .build());

        flights.add(
                Flight.builder()
                        .flightId("F104")
                        .flightNumber("SG401")
                        .airlineCode("SG")
                        .airlineName("SpiceJet")
                        .fromAirport("BLR")
                        .toAirport("DEL")
                        .departureTs(LocalDateTime.of(2026, 7, 22, 15, 30))
                        .arrivalTs(LocalDateTime.of(2026, 7, 22, 18, 15))
                        .stops(0)
                        .durationMins(165)
                        .basePrice(new BigDecimal("5100"))
                        .aircraft("Boeing 737")
                        .seatsLeft(65)
                        .build());

        flights.add(
                Flight.builder()
                        .flightId("F105")
                        .flightNumber("AI302")
                        .airlineCode("AI")
                        .airlineName("Air India")
                        .fromAirport("DEL")
                        .toAirport("CCU")
                        .departureTs(LocalDateTime.of(2026, 7, 20, 17, 45))
                        .arrivalTs(LocalDateTime.of(2026, 7, 20, 20, 0))
                        .stops(0)
                        .durationMins(135)
                        .basePrice(new BigDecimal("5900"))
                        .aircraft("Airbus A320")
                        .seatsLeft(75)
                        .build());
    }

    public List<FlightResponse> searchFlights(String fromAirport, String toAirport, LocalDate date) {

        return flights.stream()
                .filter(f -> fromAirport == null || f.getFromAirport().equalsIgnoreCase(fromAirport))
                .filter(f -> toAirport == null || f.getToAirport().equalsIgnoreCase(toAirport))
                .filter(f -> date == null || f.getDepartureTs().toLocalDate().equals(date))
                .map(this::toResponse)
                .toList();
    }

    public Flight getFlightOrThrow(String flightId) {

        return flights.stream()
                .filter(f -> f.getFlightId().equals(flightId))
                .findFirst()
                .orElseThrow(() -> new ApiException("Flight not found : " + flightId));
    }

    public void reserveSeats(Flight flight, int seats) {

        if (flight.getSeatsLeft() < seats) {
            throw new ApiException("Only " + flight.getSeatsLeft() + " seat(s) left.");
        }

        flight.setSeatsLeft(flight.getSeatsLeft() - seats);
    }

    private FlightResponse toResponse(Flight f) {

        return FlightResponse.builder()
                .flightId(f.getFlightId())
                .flightNumber(f.getFlightNumber())
                .airlineCode(f.getAirlineCode())
                .airlineName(f.getAirlineName())
                .fromAirport(f.getFromAirport())
                .toAirport(f.getToAirport())
                .departureTs(f.getDepartureTs())
                .arrivalTs(f.getArrivalTs())
                .stops(f.getStops())
                .durationMins(f.getDurationMins())
                .basePrice(f.getBasePrice())
                .aircraft(f.getAircraft())
                .seatsLeft(f.getSeatsLeft())
                .build();
    }
}