package com.example.flight.dto;

import lombok.Data;

@Data
public class AirportRequestDTO {

    private String airportCode;

    private String name;

    private String city;

    private String country;
}