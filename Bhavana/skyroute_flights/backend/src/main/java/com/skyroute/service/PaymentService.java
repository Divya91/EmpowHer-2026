package com.skyroute.service;

import com.skyroute.dto.booking.BookingResponseDto;
import com.skyroute.dto.payment.PaymentInitiateRequest;
import com.skyroute.dto.payment.PaymentVerifyRequest;
import com.skyroute.entity.Booking;
import com.skyroute.entity.Notification;
import com.skyroute.entity.Payment;
import com.skyroute.exception.BookingException;
import com.skyroute.exception.ResourceNotFoundException;
import com.skyroute.repository.BookingRepository;
import com.skyroute.repository.NotificationRepository;
import com.skyroute.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final NotificationRepository notificationRepository;
    private final BookingService bookingService;

    @Transactional
    public Map<String, Object> initiatePayment(PaymentInitiateRequest request, String userEmail) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!"PENDING".equalsIgnoreCase(booking.getBookingStatus())) {
            throw new BookingException("Booking is not in PENDING state.", "INVALID_BOOKING_STATUS");
        }

        String transactionRef = "TXN_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Payment payment = Payment.builder()
                .booking(booking)
                .transactionReference(transactionRef)
                .paymentMethod(request.getPaymentMethod())
                .paymentGateway(request.getPaymentGateway() != null ? request.getPaymentGateway() : "MOCK_GATEWAY")
                .amount(booking.getTotalAmount())
                .currency("INR")
                .paymentStatus("INITIATED")
                .build();

        paymentRepository.save(payment);

        Map<String, Object> response = new HashMap<>();
        response.put("transactionReference", transactionRef);
        response.put("amount", booking.getTotalAmount());
        response.put("currency", "INR");
        response.put("pnr", booking.getPnr());
        response.put("bookingId", booking.getId());
        response.put("paymentGateway", payment.getPaymentGateway());

        return response;
    }

    @Transactional
    public BookingResponseDto verifyPayment(PaymentVerifyRequest request, String userEmail) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        Payment payment = paymentRepository.findByTransactionReference(request.getTransactionReference())
                .orElseThrow(() -> new ResourceNotFoundException("Payment transaction not found"));

        if ("SUCCESS".equalsIgnoreCase(request.getStatus())) {
            payment.setPaymentStatus("SUCCESS");
            payment.setPaidAt(LocalDateTime.now());
            paymentRepository.save(payment);

            booking.setBookingStatus("CONFIRMED");
            bookingRepository.save(booking);

            // Create notification for confirmed booking
            notificationRepository.save(Notification.builder()
                    .user(booking.getUser())
                    .title("Booking Confirmed: " + booking.getPnr())
                    .message("Your flight ticket on " + booking.getSchedule().getFlight().getFlightNumber() + 
                            " (" + booking.getSchedule().getFlight().getOriginAirport().getCity() + " → " + 
                            booking.getSchedule().getFlight().getDestinationAirport().getCity() + ") is confirmed! Safe travels.")
                    .notificationType("BOOKING_CONFIRMED")
                    .actionUrl("/history")
                    .build());

            log.info("Payment confirmed for booking PNR: {}", booking.getPnr());
        } else {
            payment.setPaymentStatus("FAILED");
            paymentRepository.save(payment);
            throw new BookingException("Payment was declined or failed.", "PAYMENT_FAILED");
        }

        return bookingService.mapToDto(booking);
    }
}
