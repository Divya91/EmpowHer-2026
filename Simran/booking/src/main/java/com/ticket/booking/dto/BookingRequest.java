package com.ticket.booking.dto;

import lombok.Data;

@Data
public class BookingRequest {

    private Integer userId;
    private Integer flightId;
    private Integer passengerId;
    private Integer numberOfSeats;
}