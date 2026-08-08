package com.example.flight.dto;



import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AirlineRequestDTO {

    @NotBlank(message = "Airline code is required")
    @Size(min = 2, max = 3)
    private String airlineCode;

    @NotBlank(message = "Airline name is required")
    private String name;
}