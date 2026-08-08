package com.example.flight.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AirportResponseDTO {

    private String airportCode;

    private String name;

    private String city;

    private String country;
}
