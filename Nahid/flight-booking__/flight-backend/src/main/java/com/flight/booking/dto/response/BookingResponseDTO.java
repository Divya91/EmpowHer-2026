package com.flight.booking.dto.response;

import com.flight.booking.entity.BookingStatus;
import com.flight.booking.entity.PaymentMethod;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponseDTO {

    private Long bookingId;
    private String bookingReference;
    private Long flightId;
    private String airlineName;
    private String airlineCode;
    private String fromAirport;
    private String toAirport;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private Short passengers;
    private BigDecimal totalAmount;
    private PaymentMethod paymentMethod;
    private String paymentReference;
    private BookingStatus status;
    private LocalDateTime bookedAt;
    private String message;
}
