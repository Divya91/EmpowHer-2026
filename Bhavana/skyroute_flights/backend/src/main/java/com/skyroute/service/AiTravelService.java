package com.skyroute.service;

import com.skyroute.dto.ai.ChatMessageDto;
import com.skyroute.dto.ai.ChatResponseDto;
import com.skyroute.dto.flight.FlightResponseDto;
import com.skyroute.dto.flight.FlightSearchCriteria;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiTravelService {

    private final FlightService flightService;

    public ChatResponseDto processChat(ChatMessageDto request, String userEmail) {
        String msg = request.getMessage().toLowerCase();
        List<String> tools = new ArrayList<>();
        List<Map<String, Object>> suggestedFlights = new ArrayList<>();
        List<String> quickReplies = new ArrayList<>();
        String responseText;

        // Tool calling detection
        if (msg.contains("flight") || msg.contains("bengaluru") || msg.contains("delhi") || msg.contains("mumbai") || msg.contains("search")) {
            tools.add("searchFlights()");
            FlightSearchCriteria criteria = FlightSearchCriteria.builder()
                    .origin(msg.contains("delhi") && msg.contains("to bengaluru") ? "DEL" : "BLR")
                    .destination(msg.contains("mumbai") ? "BOM" : "DEL")
                    .departureDate(LocalDate.now().plusDays(2))
                    .build();

            List<FlightResponseDto> flights = flightService.searchFlights(criteria);
            if (!flights.isEmpty()) {
                flights.stream().limit(3).forEach(f -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("flightNumber", f.getFlightNumber());
                    map.put("airline", f.getAirlineName());
                    map.put("route", f.getOriginCity() + " → " + f.getDestinationCity());
                    map.put("price", "₹" + f.getTotalPrice());
                    map.put("time", f.getDepartureTime() + " - " + f.getArrivalTime());
                    map.put("duration", f.getDurationMinutes() + " mins");
                    suggestedFlights.add(map);
                });
            }

            responseText = "✈️ I found great options for your trip! Here are top-rated flights from " +
                    (msg.contains("mumbai") ? "Bengaluru to Mumbai" : "Bengaluru to Delhi") + 
                    " for " + LocalDate.now().plusDays(2) + ". Would you like me to guide you through seat selection or baggage allowances?";
            
            quickReplies.add("Show cheapest flight");
            quickReplies.add("What is the baggage limit?");
            quickReplies.add("Explain cancellation policy");

        } else if (msg.contains("baggage") || msg.contains("luggage")) {
            tools.add("getBaggageAllowancePolicy()");
            responseText = "🧳 **SkyRoute Standard Baggage Guidelines:**\n\n" +
                    "• **Cabin Baggage:** 1 piece up to 7 kg (dimensions max 115 cm total).\n" +
                    "• **Check-in Baggage (Economy):** 15 kg included on standard domestic flights (Air India offers 20-25 kg).\n" +
                    "• **Excess Baggage:** Can be pre-purchased during booking at ₹450/kg discount rate compared to airport counter charges.";
            
            quickReplies.add("Book extra baggage");
            quickReplies.add("Search flights now");

        } else if (msg.contains("cancel") || msg.contains("refund")) {
            tools.add("getCancellationPolicy()");
            responseText = "📋 **SkyRoute Ticket Cancellation & Refund Policy:**\n\n" +
                    "• Cancellations made at least 2 hours before scheduled departure are eligible for an immediate refund.\n" +
                    "• Standard flat cancellation charge is **₹500** per ticket.\n" +
                    "• The remaining balance is processed automatically and credited back to your original source payment method within 3-5 business days.";
            
            quickReplies.add("My Bookings");
            quickReplies.add("Contact Support");

        } else {
            responseText = "👋 Hello! I am your **SkyRoute AI Travel Assistant**. I can help you search the best flight fares, recommend weekend getaways, check live baggage allowances, or answer booking policies. Where would you like to fly next?";
            quickReplies.add("Find flights from Bengaluru to Delhi");
            quickReplies.add("Search flights to Mumbai");
            quickReplies.add("Explain cancellation policy");
        }

        return ChatResponseDto.builder()
                .response(responseText)
                .sessionId(request.getSessionId() != null ? request.getSessionId() : UUID.randomUUID().toString())
                .toolCallsInvoked(tools)
                .suggestedFlights(suggestedFlights)
                .quickReplies(quickReplies)
                .build();
    }
}
