package com.example.flight.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

import com.example.flight.entity.CabinClass;

@Data
public class FlightPricingRequestDTO {

    @NotNull(message = "Flight ID is required")
    private Long flightId;
      @NotNull
    private CabinClass seatClass;

    @NotNull(message = "Base fare is required")
    @DecimalMin(value = "0.0", message = "Base fare cannot be negative")
    private BigDecimal baseFare;

    @NotNull(message = "Taxes are required")
    @DecimalMin(value = "0.0", message = "Taxes cannot be negative")
    private BigDecimal taxes;

    @NotNull(message = "Convenience fee is required")
    @DecimalMin(value = "0.0", message = "Convenience fee cannot be negative")
    private BigDecimal convenienceFee;

    private String currency;
}