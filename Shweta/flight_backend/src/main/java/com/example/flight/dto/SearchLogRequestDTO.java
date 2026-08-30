package com.example.flight.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SearchLogRequestDTO {

    private Long userId;

    @NotBlank(message = "Source is required")
    @Size(max = 100, message = "Source cannot exceed 100 characters")
    private String source;

    @NotBlank(message = "Destination is required")
    @Size(max = 100, message = "Destination cannot exceed 100 characters")
    private String destination;
}