package com.example.flight.dto;

import java.time.LocalDateTime;

import com.example.flight.entity.SeatLockStatus;

import lombok.Data;

@Data
public class SeatLockResponseDTO {

    private Long seatLockId;

    private Long bookingId;

    private Long segmentId;

    private Long flightId;

    private Long passengerId;

    private String seatNumber;

    private SeatLockStatus status;

    private LocalDateTime lockedAt;

    private LocalDateTime lockedUntil;
}