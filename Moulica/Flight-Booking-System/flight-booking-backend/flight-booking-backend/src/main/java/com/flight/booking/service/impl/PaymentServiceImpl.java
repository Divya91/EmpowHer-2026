package com.flight.booking.service.impl;

import com.flight.booking.dto.request.PaymentRequestDTO;
import com.flight.booking.dto.response.PaymentResponseDTO;
import com.flight.booking.entity.Booking;
import com.flight.booking.entity.Payment;
import com.flight.booking.mapper.PaymentMapper;
import com.flight.booking.repository.BookingRepository;
import com.flight.booking.repository.PaymentRepository;
import com.flight.booking.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;
    private final BookingRepository bookingRepository;

    @Override
    @Transactional
    public PaymentResponseDTO createPayment(PaymentRequestDTO dto) {

        // 1. Find the booking
        Booking booking = bookingRepository.findById(dto.getBookingId())
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        // 2. Convert DTO to Payment
        Payment payment = paymentMapper.toEntity(dto);

        // 3. Explicitly set booking ID
        payment.setBookingId(dto.getBookingId());

        // 4. Set payment date
        payment.setPaymentDate(LocalDateTime.now());

        // 5. Save payment
        Payment savedPayment = paymentRepository.save(payment);

        // 6. If payment is successful, confirm booking
        if ("SUCCESS".equalsIgnoreCase(dto.getPaymentStatus())) {

            booking.setPaymentStatus("PAID");
            booking.setStatus("CONFIRMED");

            bookingRepository.save(booking);
        }

        // 7. Return response
        return paymentMapper.toResponseDTO(savedPayment);
    }

    @Override
    public List<PaymentResponseDTO> getAllPayments() {

        return paymentRepository.findAll()
                .stream()
                .map(paymentMapper::toResponseDTO)
                .toList();
    }

    @Override
    public PaymentResponseDTO getPaymentById(Long id) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Payment not found"));

        return paymentMapper.toResponseDTO(payment);
    }

    @Override
    public void deletePayment(Long id) {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Payment not found"));

        paymentRepository.delete(payment);
    }
}