package com.skyroute.dto.booking;

import com.skyroute.dto.flight.FlightResponseDto;
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
public class BookingResponseDto {
    private Long id;
    private String pnr;
    private String bookingStatus; // PENDING, CONFIRMED, CANCELLED, COMPLETED, REFUND_PENDING, REFUNDED
    private String cabinClass;
    private Integer passengerCount;
    private BigDecimal baseAmount;
    private BigDecimal seatCharges;
    private BigDecimal addonCharges;
    private BigDecimal taxAmount;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private String contactEmail;
    private String contactPhone;
    private String specialRequests;
    private LocalDateTime createdAt;
    private FlightResponseDto flight;
    private List<PassengerDto> passengers;
    private String paymentStatus;
    private String paymentReference;
    private Boolean isCancellable;
    private BigDecimal eligibleRefundAmount;
}
