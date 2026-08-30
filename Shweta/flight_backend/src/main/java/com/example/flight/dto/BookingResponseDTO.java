package com.example.flight.dto;



import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import com.example.flight.entity.BookingStatus;
import com.example.flight.entity.PaymentStatus;

@Data
public class BookingResponseDTO {

    private Long bookingId;

    private Long userId;

    private String bookingCode;

    private BookingStatus status;

    private PaymentStatus paymentStatus;

    private BigDecimal totalAmount;

    private LocalDateTime bookingTs;

    private List<BookingSegmentResponseDTO> segments;
}