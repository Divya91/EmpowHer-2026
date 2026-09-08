package com.flight.booking.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BookingResponseDTO {

    private Long bookingId;

    private Long userId;

    private Long flightId;

    private String bookingCode;

    private String status;

    private String paymentStatus;

    private Double totalAmount;

    private LocalDateTime bookingTs;
}