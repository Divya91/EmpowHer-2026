package com.skyroute.dto.cancellation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CancellationSummaryDto {
    private Long bookingId;
    private String pnr;
    private BigDecimal ticketAmount;
    private BigDecimal cancellationFee;
    private BigDecimal refundAmount;
    private Boolean isEligible;
    private String policyMessage;
}
