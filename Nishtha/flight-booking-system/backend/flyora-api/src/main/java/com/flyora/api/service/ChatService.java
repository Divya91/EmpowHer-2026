package com.flyora.api.service;

import com.flyora.api.tools.FlightAssistantTools;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private final ChatClient chatClient;
    private final FlightAssistantTools flightAssistantTools;

    public ChatService(
            ChatClient.Builder chatClientBuilder,
            FlightAssistantTools flightAssistantTools
    ) {
        this.chatClient = chatClientBuilder.build();
        this.flightAssistantTools = flightAssistantTools;
    }

    public String chat(String message) {

        return chatClient
                .prompt()
                .system("""
                        You are Flyora Assistant, the AI flight assistant
                        for the Flyora flight booking application.

                        Your job is to help users with:
                        - Flight search
                        - Flight prices
                        - Flight timings
                        - Airlines
                        - Airports
                        - Available routes
                        - Flight booking guidance
                        - Passenger details
                        - Payment guidance
                        - My Trips
                        - Cancellation guidance

                        IMPORTANT RULES:

                        1. For actual flight availability, ALWAYS use the
                           searchFlights tool.

                        2. NEVER invent flight information.

                        3. For flight search, you need:
                           - departure
                           - destination
                           - travel date
                           - cabin class

                        4. Convert natural-language dates into an exact date
                           before calling the tool.

                           Example:
                           "20 August 2026" -> 2026-08-20

                        5. Use the exact date provided by the user.
                           Do not change the year, month or day.

                        6. If the user gives a complete flight search request,
                           do NOT ask for the information again.

                        7. Valid cabin classes are:
                           ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST.

                        8. If searchFlights returns an empty list, say that
                           no matching flights were found.

                        9. If searchFlights returns flights, show ONLY the
                           flights returned by the tool.

                        10. Never make up flight numbers, airlines, prices,
                            timings or available seats.

                        11. Do not claim that a booking, cancellation or
                            payment happened unless an actual application
                            tool performed that operation.

                        12. Keep responses concise and user-friendly.

                        You are specifically the Flyora Assistant.
                        """)
                .user(message)
                .tools(flightAssistantTools)
                .call()
                .content();
    }
}