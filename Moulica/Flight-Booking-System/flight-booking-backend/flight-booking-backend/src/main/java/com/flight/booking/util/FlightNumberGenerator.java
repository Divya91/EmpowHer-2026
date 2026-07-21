package com.flight.booking.util;

import java.util.UUID;

public class FlightNumberGenerator {

    public static String generateFlightNumber() {
        return "FLT-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0,8)
                        .toUpperCase();
    }

}