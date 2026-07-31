package com.example.flight.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlightResponseDTO {

    private Long id;
    private String flightNumber;
    private String airline;
    private String source;
    private String destination;
    private String departureTime;
    private Double price;
    private Integer availableSeats;
}
