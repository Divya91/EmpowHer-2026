package com.flight.booking.dto.request;

import lombok.Data;

@Data
public class BookingRequestDTO {

    private Long userId;

    private Long flightId;

    private Double totalAmount;
}