package com.example.flight.dto;



import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class BookingResponseDTO {

    private Long bookingId;

    private Long userId;

    private Long flightId;

    private String bookingCode;

    private String status;

    private String paymentStatus;

    private BigDecimal totalAmount;

    private LocalDateTime bookingTs;
}