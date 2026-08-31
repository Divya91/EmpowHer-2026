package com.skyroute.controller;

import com.skyroute.dto.cancellation.RefundDto;
import com.skyroute.service.RefundService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/refunds")
@RequiredArgsConstructor
@Tag(name = "Refunds", description = "Refund Tracking and Processing APIs")
@SecurityRequirement(name = "bearerAuth")
public class RefundController {

    private final RefundService refundService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all customer refund requests (Admin only)")
    public ResponseEntity<List<RefundDto>> getAllRefunds() {
        return ResponseEntity.ok(refundService.getAllRefunds());
    }

    @PutMapping("/{id}/process")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update refund status (Approve, Process, or Complete)")
    public ResponseEntity<RefundDto> processRefund(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload
    ) {
        String status = payload.getOrDefault("status", "COMPLETED");
        String notes = payload.get("adminNotes");
        return ResponseEntity.ok(refundService.updateRefundStatus(id, status, notes));
    }
}
