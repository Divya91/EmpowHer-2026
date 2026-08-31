package com.skyroute.dto.cancellation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefundDto {
    private Long id;
    private Long bookingId;
    private String pnr;
    private String userEmail;
    private String userName;
    private BigDecimal refundAmount;
    private String refundReference;
    private String refundStatus; // NOT_APPLICABLE, REQUESTED, PROCESSING, COMPLETED, FAILED
    private String cancellationReason;
    private LocalDateTime requestDate;
    private LocalDateTime processedAt;
    private String adminNotes;
}
