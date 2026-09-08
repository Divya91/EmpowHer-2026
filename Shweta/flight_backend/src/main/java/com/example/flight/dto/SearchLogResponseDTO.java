package com.example.flight.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SearchLogResponseDTO {

    private Long searchId;

    private Long userId;

    private String source;

    private String destination;

    private LocalDateTime searchDate;
}