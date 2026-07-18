package com.flightbooking.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder
public class BookingResponse {
    private Long id;
    private String pnr;
    private String status;
    private FlightResponse flight;
    private FlightResponse returnFlight;
    private String cabinClass;
    private BigDecimal totalAmount;
    private LocalDateTime bookedAt;
    private List<PassengerResponse> passengers;

    @Data @Builder
    public static class PassengerResponse {
        private String firstName;
        private String lastName;
        private String seatNumber;
        private String type;
    }
}
