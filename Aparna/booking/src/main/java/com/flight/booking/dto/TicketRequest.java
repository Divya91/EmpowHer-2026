package com.flight.booking.dto;

import lombok.Data;

@Data
public class TicketRequest {
    private Long userId;
    private Object flightId;
    private int numberOfSeats;
}
