package com.example.flight.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.flight.entity.CabinClass;

@Data
public class FlightPricingResponseDTO {

    private Long pricingId;
        private CabinClass seatClass;

    private Long flightId;

    private BigDecimal baseFare;

    private BigDecimal taxes;

    private BigDecimal convenienceFee;

    private String currency;

    private LocalDateTime createdAt;
}