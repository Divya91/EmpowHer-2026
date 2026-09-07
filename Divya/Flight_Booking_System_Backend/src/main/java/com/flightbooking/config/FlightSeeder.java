package com.flightbooking.config;

import com.flightbooking.entity.Flight;
import com.flightbooking.repository.FlightRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.flightbooking.repository.UserRepository;
import com.flightbooking.entity.User;

@Configuration
public class FlightSeeder {

    @Bean
    CommandLineRunner initFlights(FlightRepository flightRepository, UserRepository userRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                User user = User.builder()
                        .firstName("John")
                        .lastName("Doe")
                        .email("john@example.com")
                        .passwordHash("password")
                        .role(User.Role.USER)
                        .build();
                userRepository.save(user);
            }

            if (flightRepository.count() == 0) {
                Flight flight1 = Flight.builder()
                        .flightNumber("EI-102")
                        .airline("Aer Lingus")
                        .origin("JFK")
                        .destination("LHR")
                        .departureTime(LocalDateTime.of(2026, 7, 14, 10, 15))
                        .arrivalTime(LocalDateTime.of(2026, 7, 14, 21, 0))
                        .totalSeats(200)
                        .availableSeats(200)
                        .price(BigDecimal.valueOf(380))
                        .build();
                flightRepository.save(flight1);

                Flight flight2 = Flight.builder()
                        .flightNumber("B6-101")
                        .airline("JetBlue")
                        .origin("JFK")
                        .destination("LHR")
                        .departureTime(LocalDateTime.of(2026, 7, 14, 8, 30))
                        .arrivalTime(LocalDateTime.of(2026, 7, 14, 20, 40))
                        .totalSeats(180)
                        .availableSeats(180)
                        .price(BigDecimal.valueOf(450))
                        .build();
                flightRepository.save(flight2);
                
                Flight flight3 = Flight.builder()
                        .flightNumber("AA-201")
                        .airline("American Airlines")
                        .origin("LAX")
                        .destination("JFK")
                        .departureTime(LocalDateTime.of(2026, 7, 14, 9, 0))
                        .arrivalTime(LocalDateTime.of(2026, 7, 14, 17, 30))
                        .totalSeats(150)
                        .availableSeats(150)
                        .price(BigDecimal.valueOf(280))
                        .build();
                flightRepository.save(flight3);

                Flight flight4 = Flight.builder()
                        .flightNumber("UA-305")
                        .airline("United Airlines")
                        .origin("JFK")
                        .destination("LAX")
                        .departureTime(LocalDateTime.of(2026, 7, 14, 11, 0))
                        .arrivalTime(LocalDateTime.of(2026, 7, 14, 14, 30))
                        .totalSeats(160)
                        .availableSeats(160)
                        .price(BigDecimal.valueOf(310))
                        .build();
                flightRepository.save(flight4);
            }
        };
    }
}
