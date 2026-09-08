package com.example.flight.service;

import com.example.flight.dto.PaymentRequestDTO;
import com.example.flight.dto.PaymentResponseDTO;
import com.example.flight.entity.Booking;
import com.example.flight.entity.Payment;
import com.example.flight.repository.BookingRepository;
import com.example.flight.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final ModelMapper modelMapper;

    // Get all payments
    public List<PaymentResponseDTO> getAllPayments() {

        return paymentRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Get payment by ID
    public PaymentResponseDTO getPaymentById(Long paymentId) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Payment not found with ID: "
                                        + paymentId
                        ));

        return convertToResponse(payment);
    }

    // Get payments by booking ID
    public List<PaymentResponseDTO> getPaymentsByBooking(
            Long bookingId) {

        if (!bookingRepository.existsById(bookingId)) {
            throw new RuntimeException(
                    "Booking not found with ID: " + bookingId
            );
        }

        return paymentRepository
                .findByBookingBookingId(bookingId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Get payment by transaction reference
    public PaymentResponseDTO getPaymentByTransactionRef(
            String transactionRef) {

        Payment payment =
                paymentRepository.findByTransactionRef(transactionRef)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Payment not found with transaction reference: "
                                                + transactionRef
                                ));

        return convertToResponse(payment);
    }

    // Add payment
    public PaymentResponseDTO addPayment(
            PaymentRequestDTO dto) {

        Booking booking =
                bookingRepository.findById(dto.getBookingId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Booking not found with ID: "
                                                + dto.getBookingId()
                                ));

        // Check transaction reference if provided
        if (dto.getTransactionRef() != null
                && !dto.getTransactionRef().isBlank()
                && paymentRepository.existsByTransactionRef(
                        dto.getTransactionRef())) {

            throw new RuntimeException(
                    "Transaction reference already exists"
            );
        }

        Payment payment =
                modelMapper.map(dto, Payment.class);

        // Set Booking relationship
        payment.setBooking(booking);

        // Set paid time
        payment.setPaidAt(LocalDateTime.now());

        Payment savedPayment =
                paymentRepository.save(payment);

        return convertToResponse(savedPayment);
    }

    // Update payment
    public PaymentResponseDTO updatePayment(
            Long paymentId,
            PaymentRequestDTO dto) {

        Payment payment =
                paymentRepository.findById(paymentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Payment not found with ID: "
                                                + paymentId
                                ));

        Booking booking =
                bookingRepository.findById(dto.getBookingId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Booking not found with ID: "
                                                + dto.getBookingId()
                                ));

        // Update normal fields
        modelMapper.map(dto, payment);

        // Update Booking relationship
        payment.setBooking(booking);

        Payment updatedPayment =
                paymentRepository.save(payment);

        return convertToResponse(updatedPayment);
    }

    // Delete payment
    public void deletePayment(Long paymentId) {

        Payment payment =
                paymentRepository.findById(paymentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Payment not found with ID: "
                                                + paymentId
                                ));

        paymentRepository.delete(payment);
    }

    // Entity -> Response DTO
    private PaymentResponseDTO convertToResponse(
            Payment payment) {

        PaymentResponseDTO response =
                modelMapper.map(
                        payment,
                        PaymentResponseDTO.class
                );

        response.setBookingId(
                payment.getBooking().getBookingId()
        );

        return response;
    }
}