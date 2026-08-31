package com.skyroute.dto.flight;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatDto {
    private Long id;
    private String seatNumber;
    private String cabinClass;
    private String seatType; // WINDOW, AISLE, MIDDLE, EXTRA_LEGROOM, EMERGENCY_EXIT
    private BigDecimal priceSurcharge;
    private Boolean isBooked;
    private Boolean isBlocked;
}
