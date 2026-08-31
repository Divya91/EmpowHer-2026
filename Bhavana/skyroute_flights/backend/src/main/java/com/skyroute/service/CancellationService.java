package com.skyroute.service;

import com.skyroute.dto.cancellation.CancellationRequest;
import com.skyroute.dto.cancellation.CancellationSummaryDto;
import com.skyroute.entity.Booking;
import com.skyroute.entity.Cancellation;
import com.skyroute.entity.Notification;
import com.skyroute.entity.Refund;
import com.skyroute.exception.BookingException;
import com.skyroute.exception.ResourceNotFoundException;
import com.skyroute.repository.BookingRepository;
import com.skyroute.repository.CancellationRepository;
import com.skyroute.repository.NotificationRepository;
import com.skyroute.repository.RefundRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CancellationService {

    private final BookingRepository bookingRepository;
    private final CancellationRepository cancellationRepository;
    private final RefundRepository refundRepository;
    private final NotificationRepository notificationRepository;

    public CancellationSummaryDto calculateCancellationFee(Long bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        boolean isEligible = "CONFIRMED".equalsIgnoreCase(booking.getBookingStatus()) &&
                booking.getSchedule().getDepartureDatetime().isAfter(LocalDateTime.now().plusHours(2));

        BigDecimal fee = BigDecimal.valueOf(500.00);
        BigDecimal refundAmount = isEligible ? booking.getTotalAmount().subtract(fee).max(BigDecimal.ZERO) : BigDecimal.ZERO;

        return CancellationSummaryDto.builder()
                .bookingId(booking.getId())
                .pnr(booking.getPnr())
                .ticketAmount(booking.getTotalAmount())
                .cancellationFee(fee)
                .refundAmount(refundAmount)
                .isEligible(isEligible)
                .policyMessage(isEligible ? "Standard cancellation fee of ₹500 applies. Refund processed within 3-5 business days." 
                                          : "This flight has either departed or is within the non-cancellation window (2h before departure).")
                .build();
    }

    @Transactional
    public CancellationSummaryDto cancelBooking(CancellationRequest request, String userEmail) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!"CONFIRMED".equalsIgnoreCase(booking.getBookingStatus())) {
            throw new BookingException("Only confirmed bookings can be cancelled.", "INVALID_BOOKING_STATUS");
        }

        if (booking.getSchedule().getDepartureDatetime().isBefore(LocalDateTime.now().plusHours(2))) {
            throw new BookingException("Flight departs within 2 hours or has already departed. Cancellation is no longer permitted.", "CANCELLATION_WINDOW_CLOSED");
        }

        BigDecimal cancellationFee = BigDecimal.valueOf(500.00);
        BigDecimal refundAmount = booking.getTotalAmount().subtract(cancellationFee).max(BigDecimal.ZERO);

        // Record cancellation
        Cancellation cancellation = Cancellation.builder()
                .booking(booking)
                .user(booking.getUser())
                .cancellationReason(request.getCancellationReason())
                .comments(request.getComments())
                .ticketAmount(booking.getTotalAmount())
                .cancellationFee(cancellationFee)
                .refundAmount(refundAmount)
                .cancellationStatus("CONFIRMED")
                .build();

        cancellationRepository.save(cancellation);

        // Update booking status
        booking.setBookingStatus("CANCELLED");
        bookingRepository.save(booking);

        // Free up seat availability
        booking.getSchedule().setAvailableEconomySeats(
                booking.getSchedule().getAvailableEconomySeats() + booking.getPassengerCount()
        );

        // Initiate Refund Record
        String refundRef = "REF_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Refund refund = Refund.builder()
                .cancellation(cancellation)
                .booking(booking)
                .user(booking.getUser())
                .refundAmount(refundAmount)
                .refundReference(refundRef)
                .refundStatus("PROCESSING")
                .adminNotes("Auto-initiated refund upon customer ticket cancellation.")
                .build();

        refundRepository.save(refund);

        // Notify user
        notificationRepository.save(Notification.builder()
                .user(booking.getUser())
                .title("Booking Cancelled: " + booking.getPnr())
                .message("Your booking " + booking.getPnr() + " has been cancelled. A refund of ₹" + refundAmount + 
                        " (Ref: " + refundRef + ") is being processed to your original payment method.")
                .notificationType("BOOKING_CANCELLED")
                .actionUrl("/history")
                .build());

        log.info("Booking {} cancelled by user {}. Refund amount: {}", booking.getPnr(), userEmail, refundAmount);

        return CancellationSummaryDto.builder()
                .bookingId(booking.getId())
                .pnr(booking.getPnr())
                .ticketAmount(booking.getTotalAmount())
                .cancellationFee(cancellationFee)
                .refundAmount(refundAmount)
                .isEligible(true)
                .policyMessage("Cancellation successful. Your refund of ₹" + refundAmount + " is currently processing.")
                .build();
    }
}
