package com.flightbooking.dto;

import com.flightbooking.entity.Booking;
import com.flightbooking.entity.Passenger;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private Long bookingId;
    private Long flightId;
    private String flightNumber;
    private String airline;
    private String origin;
    private String destination;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private LocalDateTime bookingDate;
    private String status;
    private BigDecimal totalAmount;
    private List<Passenger> passengers;
    private Long userId;
    private String userEmail;
}
