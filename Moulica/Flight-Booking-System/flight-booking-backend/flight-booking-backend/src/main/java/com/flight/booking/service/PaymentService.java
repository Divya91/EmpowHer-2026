package com.flight.booking.service;

import com.flight.booking.dto.request.PaymentRequestDTO;
import com.flight.booking.dto.response.PaymentResponseDTO;

import java.util.List;

public interface PaymentService {

    PaymentResponseDTO createPayment(PaymentRequestDTO dto);

    List<PaymentResponseDTO> getAllPayments();

    PaymentResponseDTO getPaymentById(Long id);

    void deletePayment(Long id);

}