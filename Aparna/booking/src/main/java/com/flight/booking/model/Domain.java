package com.flight.booking.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Domain {
    FLIGHTS_SEARCH("FLIGHTS_SEARCH", "Flights & Search", "flights-search"),
    BOOKINGS_TICKETS("BOOKINGS_TICKETS", "Bookings & Tickets", "bookings-tickets"),
    ACCOUNT_PAYMENTS("ACCOUNT_PAYMENTS", "Account & Payments", "account-payments");

    private final String code;
    private final String displayName;
    private final String resourceName;

    @JsonValue
    public String getCode() {
        return code;
    }

    @JsonCreator
    public static Domain fromCode(String code) {
        if (code == null) return FLIGHTS_SEARCH;
        for (Domain d : Domain.values()) {
            if (d.getCode().equalsIgnoreCase(code) || d.name().equalsIgnoreCase(code)) {
                return d;
            }
        }
        return FLIGHTS_SEARCH;
    }
}
