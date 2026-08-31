package com.skyroute.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardDto {
    private Long totalUsers;
    private Long totalFlights;
    private Long totalBookings;
    private Long todayBookings;
    private BigDecimal totalRevenue;
    private Long cancelledBookings;
    private Long pendingRefunds;
    private Long activeFlights;
    private List<Map<String, Object>> revenueTrends;
    private List<Map<String, Object>> popularRoutes;
    private List<Map<String, Object>> airlineDistribution;
    private Double cancellationRate;
}
