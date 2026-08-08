package com.example.flight.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class FlightPricingResponseDTO {

    private Long pricingId;

    private Long flightId;

    private BigDecimal baseFare;

    private BigDecimal taxes;

    private BigDecimal convenienceFee;

    private String currency;

    private LocalDateTime createdAt;
}