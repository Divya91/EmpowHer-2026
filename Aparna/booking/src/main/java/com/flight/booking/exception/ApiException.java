package com.flight.booking.exception;

public class ApiException extends RuntimeException {
    public ApiException(String message) {
        super(message);
    }
}
