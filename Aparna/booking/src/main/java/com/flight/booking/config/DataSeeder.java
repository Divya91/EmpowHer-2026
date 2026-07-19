package com.flight.booking.config;

import com.flight.booking.entity.Flight;
import com.flight.booking.repository.FlightRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedFlights(FlightRepository flightRepository) {
        return args -> {
            if (flightRepository.count() > 0) {
                return;
            }

            LocalDate laxDate = LocalDate.of(2026, 6, 7);
            LocalDate lhrDate = LocalDate.of(2026, 7, 14);

            flightRepository.saveAll(List.of(
                    flight("AA123", "AA-123", "AA", "American Airlines", "JFK", "LAX",
                            laxDate.atTime(8, 0), laxDate.atTime(12, 0), 0, 240, "375.00", "Boeing 777-300ER", 50),
                    flight("DL456", "DL-456", "DL", "Delta Air Lines", "JFK", "LAX",
                            laxDate.atTime(9, 0), laxDate.atTime(14, 0), 1, 300, "310.00", "Airbus A330-300", 35),
                    flight("UA789", "UA-789", "UA", "United Airlines", "JFK", "LAX",
                            laxDate.atTime(7, 30), laxDate.atTime(13, 30), 0, 360, "395.00", "Boeing 787-9", 42),

                    flight("EI102", "EI-102", "EI", "Aer Lingus", "JFK", "LHR",
                            lhrDate.atTime(10, 15), lhrDate.atTime(21, 0), 1, 585, "31500", "Airbus A330-300", 24),
                    flight("B6101", "B6-101", "B6", "JetBlue", "JFK", "LHR",
                            lhrDate.atTime(8, 30), lhrDate.atTime(20, 40), 0, 430, "37500", "Airbus A321LR", 18),
                    flight("AA105", "AA-105", "AA", "American Airlines", "JFK", "LHR",
                            lhrDate.atTime(7, 10), lhrDate.atTime(19, 20), 0, 430, "41000", "Boeing 777-200ER", 20),
                    flight("BA103", "BA-103", "BA", "British Airways", "JFK", "LHR",
                            lhrDate.atTime(13, 35), lhrDate.atTime(22, 45), 0, 430, "43000", "Boeing 777-300ER", 9),
                    flight("VS104", "VS-104", "VS", "Virgin Atlantic", "JFK", "LHR",
                            lhrDate.atTime(14, 45), lhrDate.atTime(23, 55), 0, 430, "50500", "Airbus A350-1000", 15),
                    flight("DL201", "DL-201", "DL", "Delta Air Lines", "JFK", "LHR",
                            lhrDate.atTime(18, 20), lhrDate.plusDays(1).atTime(6, 10), 0, 410, "46500", "Airbus A330-900neo", 6),
                    flight("UA901", "UA-901", "UA", "United Airlines", "JFK", "LHR",
                            lhrDate.atTime(21, 50), lhrDate.plusDays(1).atTime(9, 35), 0, 405, "39000", "Boeing 767-400ER", 31),
                    flight("AF023", "AF-023", "AF", "Air France", "JFK", "LHR",
                            lhrDate.atTime(11, 5), lhrDate.atTime(23, 50), 1, 645, "33600", "Airbus A350-900", 12),
                    flight("LH402", "LH-402", "LH", "Lufthansa", "JFK", "LHR",
                            lhrDate.atTime(16, 15), lhrDate.plusDays(1).atTime(5, 30), 1, 675, "34500", "Airbus A340-600", 27),
                    flight("IB720", "IB-720", "IB", "Iberia", "JFK", "LHR",
                            lhrDate.atTime(19, 40), lhrDate.plusDays(1).atTime(8, 55), 1, 675, "32400", "Airbus A330-200", 3)
            ));
        };
    }

    private Flight flight(String id, String number, String airlineCode, String airlineName, String from, String to,
                           LocalDateTime dep, LocalDateTime arr, int stops, int durationMins,
                           String price, String aircraft, int seats) {
        return Flight.builder()
                .flightId(id)
                .flightNumber(number)
                .airlineCode(airlineCode)
                .airlineName(airlineName)
                .fromAirport(from)
                .toAirport(to)
                .departureTs(dep)
                .arrivalTs(arr)
                .stops(stops)
                .durationMins(durationMins)
                .basePrice(new BigDecimal(price))
                .aircraft(aircraft)
                .seatsLeft(seats)
                .build();
    }
}
