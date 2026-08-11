package com.example.flight.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class BookingSegmentResponseDTO {

    private Long segmentId;

    private Long bookingId;

    private Long flightId;

    private String airlineCode;

    private String fromAirport;

    private String toAirport;

    private LocalDateTime departureTs;

    private LocalDateTime arrivalTs;

    private Integer segmentOrder;
}