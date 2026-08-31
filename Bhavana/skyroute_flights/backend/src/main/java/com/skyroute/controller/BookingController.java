package com.skyroute.controller;

import com.skyroute.dto.booking.BookingCreateRequest;
import com.skyroute.dto.booking.BookingResponseDto;
import com.skyroute.dto.cancellation.CancellationRequest;
import com.skyroute.dto.cancellation.CancellationSummaryDto;
import com.skyroute.service.BookingService;
import com.skyroute.service.CancellationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Passenger Booking Creation, History, Details, and Cancellation")
@SecurityRequirement(name = "bearerAuth")
public class BookingController {

    private final BookingService bookingService;
    private final CancellationService cancellationService;

    @PostMapping
    @Operation(summary = "Create a new flight booking for passengers with seat reservation")
    public ResponseEntity<BookingResponseDto> createBooking(
            @Valid @RequestBody BookingCreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String email = userDetails != null ? userDetails.getUsername() : request.getContactEmail();
        return ResponseEntity.ok(bookingService.createBooking(request, email));
    }

    @GetMapping
    @Operation(summary = "Get booking history for the authenticated user")
    public ResponseEntity<List<BookingResponseDto>> getUserBookings(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(bookingService.getUserBookings(userDetails.getUsername()));
    }

    @GetMapping("/{pnr}")
    @Operation(summary = "Get specific booking details by 6-character PNR")
    public ResponseEntity<BookingResponseDto> getByPnr(
            @PathVariable String pnr,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String email = userDetails != null ? userDetails.getUsername() : null;
        return ResponseEntity.ok(bookingService.getBookingByPnr(pnr, email));
    }

    @GetMapping("/{id}/cancellation-summary")
    @Operation(summary = "Preview cancellation refund amount and fee before confirming")
    public ResponseEntity<CancellationSummaryDto> getCancellationSummary(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(cancellationService.calculateCancellationFee(id, userDetails.getUsername()));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel confirmed ticket booking and trigger refund processing")
    public ResponseEntity<CancellationSummaryDto> cancelBooking(
            @PathVariable Long id,
            @Valid @RequestBody CancellationRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        request.setBookingId(id);
        return ResponseEntity.ok(cancellationService.cancelBooking(request, userDetails.getUsername()));
    }
}
