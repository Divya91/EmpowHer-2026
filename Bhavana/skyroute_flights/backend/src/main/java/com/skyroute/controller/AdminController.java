package com.skyroute.controller;

import com.skyroute.dto.admin.AdminDashboardDto;
import com.skyroute.dto.booking.BookingResponseDto;
import com.skyroute.entity.Flight;
import com.skyroute.entity.User;
import com.skyroute.service.AdminService;
import com.skyroute.service.BookingService;
import com.skyroute.service.FlightService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Portal", description = "Administrative Dashboard, Flight Management, Booking Oversight, and User Controls")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final AdminService adminService;
    private final BookingService bookingService;
    private final FlightService flightService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get high-level analytics, revenue trends, route performance, and KPIs")
    public ResponseEntity<AdminDashboardDto> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboardMetrics());
    }

    @GetMapping("/users")
    @Operation(summary = "List all registered platform users")
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/flights")
    @Operation(summary = "List all active commercial flights")
    public ResponseEntity<List<Flight>> getFlights() {
        return ResponseEntity.ok(adminService.getAllFlights());
    }
}
