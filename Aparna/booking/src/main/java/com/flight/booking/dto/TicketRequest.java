package com.flight.booking.dto;

import lombok.Data;

@Data
public class TicketRequest {
    private Long userId;
    private Long flightId;
    private int numberOfSeats;
}
