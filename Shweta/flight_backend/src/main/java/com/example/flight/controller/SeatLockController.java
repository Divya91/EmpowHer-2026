package com.example.flight.controller;

import com.example.flight.dto.SeatLockRequestDTO;
import com.example.flight.dto.SeatLockResponseDTO;
import com.example.flight.service.SeatLockService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seat-locks")
@RequiredArgsConstructor
public class SeatLockController {

    private final SeatLockService seatLockService;


    // =====================================================
    // AUTOMATICALLY ALLOCATE AND LOCK SEAT
    // =====================================================

    @PostMapping
    public ResponseEntity<SeatLockResponseDTO> allocateAndLockSeat(
            @Valid @RequestBody SeatLockRequestDTO request,
            Authentication authentication) {

        // Get logged-in user's email from JWT
        String email =
                authentication.getName();

        SeatLockResponseDTO response =
                seatLockService.allocateAndLockSeat(
                        request,
                        email
                );

        return ResponseEntity.ok(response);
    }


    // =====================================================
    // GET ALL SEAT LOCKS FOR A BOOKING
    // =====================================================

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<SeatLockResponseDTO>>
    getBookingSeatLocks(
            @PathVariable Long bookingId) {

        List<SeatLockResponseDTO> response =
                seatLockService.getBookingSeatLocks(
                        bookingId
                );

        return ResponseEntity.ok(response);
    }
}