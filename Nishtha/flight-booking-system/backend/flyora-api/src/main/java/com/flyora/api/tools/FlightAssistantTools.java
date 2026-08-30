package com.flyora.api.tools;

import com.flyora.api.dto.response.FlightResponse;
import com.flyora.api.enums.CabinClass;
import com.flyora.api.service.FlightService;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Locale;

@Component
public class FlightAssistantTools {

    private final FlightService flightService;

    public FlightAssistantTools(FlightService flightService) {
        this.flightService = flightService;
    }

    @Tool(description = """
            Search for actual available flights in Flyora.

            ALWAYS use this tool when the user asks about:
            - available flights
            - flight options
            - flight prices
            - departure times
            - arrival times
            - airlines
            - available seats

            Required information:
            - departure city or airport
            - destination city or airport
            - travel date
            - cabin class

            Valid cabin classes:
            ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST.

            The tool searches the actual Flyora PostgreSQL database.
            Never invent flight information.
            """)
    public List<FlightResponse> searchFlights(
            String from,
            String to,
            LocalDate travelDate,
            CabinClass cabinClass
    ) {

        String normalizedFrom = normalizeAirport(from);
        String normalizedTo = normalizeAirport(to);

        // Get actual flights from the database
        List<FlightResponse> allFlights = flightService.getAllFlights();

        // Filter in Java instead of relying on exact database strings.
        return allFlights.stream()
                .filter(flight ->
                        flight.getTravelDate() != null
                                && flight.getTravelDate().equals(travelDate)
                )
                .filter(flight ->
                        normalizeAirport(flight.getFromAirport())
                                .equalsIgnoreCase(normalizedFrom)
                )
                .filter(flight ->
                        normalizeAirport(flight.getToAirport())
                                .equalsIgnoreCase(normalizedTo)
                )
                .filter(flight ->
                        flight.getCabinClass() == cabinClass
                )
                .toList();
    }

    @Tool(description = """
            Get the list of airports currently available in Flyora.

            Use this when the user asks:
            - Which airports are available?
            - What airports can I fly from?
            - What destinations are available?
            - Show available airports.

            Return only airports that exist in the Flyora database.
            """)
    public List<String> getAvailableAirports() {

        return flightService.getAirports();
    }

    @Tool(description = """
            Get the airlines currently available in Flyora.

            Use this when the user asks:
            - Which airlines are available?
            - What airlines does Flyora support?
            - Show available airlines.

            Return only airlines present in the Flyora database.
            """)
    public List<String> getAvailableAirlines() {

        return flightService.getAirlines();
    }

    @Tool(description = """
            Get the routes currently available in Flyora.

            Use this when the user asks:
            - What routes are available?
            - Which destinations can I travel to?
            - Show available flight routes.

            Return only routes present in the Flyora database.
            """)
    public List<String> getAvailableRoutes() {

        return flightService.getRoutes();
    }

    private String normalizeAirport(String airport) {

        if (airport == null || airport.isBlank()) {
            return "";
        }

        String value = airport
                .trim()
                .toLowerCase(Locale.ROOT);

        return switch (value) {

            // Delhi
            case "del",
                 "delhi",
                 "delhi airport",
                 "indira gandhi international airport",
                 "indira gandhi international",
                 "indira gandhi airport" -> "Delhi";

            // Mumbai
            case "bom",
                 "mumbai",
                 "mumbai airport",
                 "chhatrapati shivaji maharaj international airport",
                 "chhatrapati shivaji maharaj international",
                 "chhatrapati shivaji airport" -> "Mumbai";

            default ->
                    value.substring(0, 1).toUpperCase(Locale.ROOT)
                            + value.substring(1);
        };
    }
}