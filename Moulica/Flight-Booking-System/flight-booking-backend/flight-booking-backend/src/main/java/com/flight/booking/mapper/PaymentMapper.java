package com.flight.booking.mapper;

import com.flight.booking.dto.request.PaymentRequestDTO;
import com.flight.booking.dto.response.PaymentResponseDTO;
import com.flight.booking.entity.Payment;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class PaymentMapper {

    public Payment toEntity(PaymentRequestDTO dto) {

        Payment payment = new Payment();

        payment.setAmount(dto.getAmount());
        payment.setPaymentMethod(dto.getPaymentMethod());
        payment.setPaymentStatus(dto.getPaymentStatus());
        payment.setTransactionId(dto.getTransactionId());

        // Automatically store payment time
        payment.setPaymentDate(LocalDateTime.now());

        return payment;
    }

    public PaymentResponseDTO toResponseDTO(Payment payment) {

        PaymentResponseDTO dto = new PaymentResponseDTO();

        dto.setPaymentId(payment.getPaymentId());
        dto.setAmount(payment.getAmount());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setPaymentStatus(payment.getPaymentStatus());
        dto.setTransactionId(payment.getTransactionId());
        dto.setPaymentDate(payment.getPaymentDate());

        return dto;
    }

    public void updateEntity(PaymentRequestDTO dto, Payment payment) {

        payment.setAmount(dto.getAmount());
        payment.setPaymentMethod(dto.getPaymentMethod());
        payment.setPaymentStatus(dto.getPaymentStatus());
        payment.setTransactionId(dto.getTransactionId());
    }
}