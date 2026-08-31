package com.skyroute.service;

import com.skyroute.dto.cancellation.RefundDto;
import com.skyroute.entity.Notification;
import com.skyroute.entity.Refund;
import com.skyroute.exception.ResourceNotFoundException;
import com.skyroute.repository.NotificationRepository;
import com.skyroute.repository.RefundRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RefundService {

    private final RefundRepository refundRepository;
    private final NotificationRepository notificationRepository;

    public List<RefundDto> getAllRefunds() {
        return refundRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<RefundDto> getUserRefunds(Long userId) {
        return refundRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public RefundDto updateRefundStatus(Long refundId, String status, String adminNotes) {
        Refund refund = refundRepository.findById(refundId)
                .orElseThrow(() -> new ResourceNotFoundException("Refund record not found"));

        refund.setRefundStatus(status);
        if ("COMPLETED".equalsIgnoreCase(status)) {
            refund.setProcessedAt(LocalDateTime.now());
            if (adminNotes != null) refund.setAdminNotes(adminNotes);

            // Notify user of successful refund
            notificationRepository.save(Notification.builder()
                    .user(refund.getUser())
                    .title("Refund Completed: ₹" + refund.getRefundAmount())
                    .message("Your refund for booking " + refund.getBooking().getPnr() + 
                            " (Ref: " + refund.getRefundReference() + ") has been credited to your source account.")
                    .notificationType("REFUND_COMPLETED")
                    .actionUrl("/history")
                    .build());
        }

        Refund updated = refundRepository.save(refund);
        return mapToDto(updated);
    }

    private RefundDto mapToDto(Refund r) {
        return RefundDto.builder()
                .id(r.getId())
                .bookingId(r.getBooking().getId())
                .pnr(r.getBooking().getPnr())
                .userEmail(r.getUser().getEmail())
                .userName(r.getUser().getFullName())
                .refundAmount(r.getRefundAmount())
                .refundReference(r.getRefundReference())
                .refundStatus(r.getRefundStatus())
                .cancellationReason(r.getCancellation().getCancellationReason())
                .requestDate(r.getCreatedAt())
                .processedAt(r.getProcessedAt())
                .adminNotes(r.getAdminNotes())
                .build();
    }
}
