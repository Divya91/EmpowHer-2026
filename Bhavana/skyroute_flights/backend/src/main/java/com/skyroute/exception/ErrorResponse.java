package com.skyroute.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    private Boolean success;
    private String message;
    private String errorCode;
    private Integer status;
    private LocalDateTime timestamp;
    private List<String> details;
}
