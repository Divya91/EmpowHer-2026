package com.example.flight.service;

import com.example.flight.dto.BookingCancellationRequestDTO;
import com.example.flight.dto.BookingCancellationResponseDTO;
import com.example.flight.entity.Booking;
import com.example.flight.entity.BookingCancellation;
import com.example.flight.repository.BookingCancellationRepository;
import com.example.flight.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingCancellationService {

    private final BookingCancellationRepository cancellationRepository;
    private final BookingRepository bookingRepository;
    private final ModelMapper modelMapper;

    // Get all cancellations
    public List<BookingCancellationResponseDTO> getAllCancellations() {

        return cancellationRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Get cancellation by ID
    public BookingCancellationResponseDTO getCancellationById(
            Long cancellationId) {

        BookingCancellation cancellation =
                cancellationRepository.findById(cancellationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Cancellation not found with ID: "
                                                + cancellationId
                                ));

        return convertToResponse(cancellation);
    }

    // Get cancellations by booking
    public List<BookingCancellationResponseDTO>
    getCancellationsByBooking(Long bookingId) {

        if (!bookingRepository.existsById(bookingId)) {
            throw new RuntimeException(
                    "Booking not found with ID: " + bookingId
            );
        }

        return cancellationRepository
                .findByBookingBookingId(bookingId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Create cancellation
    public BookingCancellationResponseDTO createCancellation(
            BookingCancellationRequestDTO dto) {

        Booking booking =
                bookingRepository.findById(dto.getBookingId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Booking not found with ID: "
                                                + dto.getBookingId()
                                ));

        BookingCancellation cancellation =
                modelMapper.map(
                        dto,
                        BookingCancellation.class
                );

        cancellation.setBooking(booking);

        // Default cancellation charges
        if (cancellation.getCancellationCharges() == null) {
            cancellation.setCancellationCharges(
                    BigDecimal.ZERO
            );
        }

        // Calculate refund if not provided
        if (cancellation.getRefundAmount() == null) {

            BigDecimal totalAmount =
                    booking.getTotalAmount();

            BigDecimal refund =
                    totalAmount.subtract(
                            cancellation.getCancellationCharges()
                    );

            if (refund.compareTo(BigDecimal.ZERO) < 0) {
                refund = BigDecimal.ZERO;
            }

            cancellation.setRefundAmount(refund);
        }

        cancellation.setProcessedAt(
                LocalDateTime.now()
        );

        // Update booking status
       // booking.setStatus("CANCELLED");

        bookingRepository.save(booking);

        BookingCancellation savedCancellation =
                cancellationRepository.save(cancellation);

        return convertToResponse(savedCancellation);
    }

    // Update cancellation
    public BookingCancellationResponseDTO updateCancellation(
            Long cancellationId,
            BookingCancellationRequestDTO dto) {

        BookingCancellation cancellation =
                cancellationRepository.findById(cancellationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Cancellation not found with ID: "
                                                + cancellationId
                                ));

        Booking booking =
                bookingRepository.findById(dto.getBookingId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Booking not found with ID: "
                                                + dto.getBookingId()
                                ));

        modelMapper.map(dto, cancellation);

        cancellation.setBooking(booking);

        if (cancellation.getCancellationCharges() == null) {
            cancellation.setCancellationCharges(
                    BigDecimal.ZERO
            );
        }

        if (cancellation.getRefundAmount() == null) {

            BigDecimal refund =
                    booking.getTotalAmount()
                            .subtract(
                                    cancellation
                                            .getCancellationCharges()
                            );

            if (refund.compareTo(BigDecimal.ZERO) < 0) {
                refund = BigDecimal.ZERO;
            }

            cancellation.setRefundAmount(refund);
        }

        BookingCancellation updatedCancellation =
                cancellationRepository.save(cancellation);

        return convertToResponse(updatedCancellation);
    }

    // Delete cancellation
    public void deleteCancellation(Long cancellationId) {

        BookingCancellation cancellation =
                cancellationRepository.findById(cancellationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Cancellation not found with ID: "
                                                + cancellationId
                                ));

        cancellationRepository.delete(cancellation);
    }

    // Entity -> Response DTO
    private BookingCancellationResponseDTO convertToResponse(
            BookingCancellation cancellation) {

        BookingCancellationResponseDTO response =
                modelMapper.map(
                        cancellation,
                        BookingCancellationResponseDTO.class
                );

        response.setBookingId(
                cancellation.getBooking().getBookingId()
        );

        return response;
    }
}