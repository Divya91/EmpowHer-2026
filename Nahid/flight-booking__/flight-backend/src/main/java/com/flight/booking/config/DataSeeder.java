package com.flight.booking.config;

import com.flight.booking.entity.*;
import com.flight.booking.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final AirlineRepository airlineRepository;
    private final AirportRepository airportRepository;
    private final FlightRepository flightRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (airlineRepository.count() > 0) {
            return;
        }

        seedAirlines();
        seedAirports();
        seedFlights();
        seedDemoUser();
    }

    private void seedAirlines() {
        airlineRepository.saveAll(List.of(
                Airline.builder().airlineCode("AI").name("Air India").build(),
                Airline.builder().airlineCode("6E").name("IndiGo").build(),
                Airline.builder().airlineCode("SG").name("SpiceJet").build(),
                Airline.builder().airlineCode("UK").name("Vistara").build()
        ));
    }

    private void seedAirports() {
        airportRepository.saveAll(List.of(
                Airport.builder().airportCode("DEL").name("Indira Gandhi Intl").city("New Delhi").country("India").build(),
                Airport.builder().airportCode("BOM").name("Chhatrapati Shivaji Intl").city("Mumbai").country("India").build(),
                Airport.builder().airportCode("BLR").name("Kempegowda Intl").city("Bengaluru").country("India").build(),
                Airport.builder().airportCode("HYD").name("Rajiv Gandhi Intl").city("Hyderabad").country("India").build(),
                Airport.builder().airportCode("MAA").name("Chennai Intl").city("Chennai").country("India").build(),
                Airport.builder().airportCode("CCU").name("Netaji Subhas Intl").city("Kolkata").country("India").build()
        ));
    }

    private void seedFlights() {
        Airline ai = airlineRepository.findById("AI").orElseThrow();
        Airline indigo = airlineRepository.findById("6E").orElseThrow();
        Airline spice = airlineRepository.findById("SG").orElseThrow();
        Airline vistara = airlineRepository.findById("UK").orElseThrow();

        Airport del = airportRepository.findById("DEL").orElseThrow();
        Airport bom = airportRepository.findById("BOM").orElseThrow();
        Airport blr = airportRepository.findById("BLR").orElseThrow();
        Airport hyd = airportRepository.findById("HYD").orElseThrow();
        Airport maa = airportRepository.findById("MAA").orElseThrow();
        Airport ccu = airportRepository.findById("CCU").orElseThrow();

        LocalDateTime base = LocalDateTime.now().plusDays(1).withHour(6).withMinute(0).withSecond(0).withNano(0);

        flightRepository.saveAll(List.of(
                buildFlight(ai, del, bom, base, 135, (short) 0, new BigDecimal("4500"), (short) 120),
                buildFlight(indigo, del, bom, base.plusHours(3), 130, (short) 0, new BigDecimal("3800"), (short) 150),
                buildFlight(spice, del, blr, base.plusHours(1), 150, (short) 0, new BigDecimal("3200"), (short) 90),
                buildFlight(vistara, bom, blr, base.plusHours(2), 95, (short) 0, new BigDecimal("4100"), (short) 110),
                buildFlight(indigo, blr, hyd, base.plusHours(4), 70, (short) 0, new BigDecimal("2900"), (short) 140),
                buildFlight(ai, hyd, maa, base.plusHours(5), 75, (short) 0, new BigDecimal("3500"), (short) 100),
                buildFlight(spice, maa, ccu, base.plusHours(6), 140, (short) 1, new BigDecimal("4200"), (short) 80),
                buildFlight(vistara, del, ccu, base.plusHours(7), 150, (short) 1, new BigDecimal("5500"), (short) 70),
                buildFlight(indigo, bom, hyd, base.plusHours(8), 85, (short) 0, new BigDecimal("3600"), (short) 130),
                buildFlight(ai, blr, bom, base.plusHours(9), 100, (short) 0, new BigDecimal("3900"), (short) 95)
        ));
    }

    private Flight buildFlight(
            Airline airline,
            Airport from,
            Airport to,
            LocalDateTime departure,
            int durationMins,
            short stops,
            BigDecimal price,
            short seats
    ) {
        return Flight.builder()
                .airline(airline)
                .fromAirport(from)
                .toAirport(to)
                .departureTime(departure)
                .arrivalTime(departure.plusMinutes(durationMins))
                .durationMinutes(durationMins)
                .stops(stops)
                .basePrice(price)
                .availableSeats(seats)
                .build();
    }

    private void seedDemoUser() {
        userRepository.save(User.builder()
                .firstName("Demo")
                .lastName("User")
                .email("demo@example.com")
                .password(passwordEncoder.encode("password123"))
                .role(Role.CUSTOMER)
                .createdAt(LocalDateTime.now())
                .build());
    }
}
