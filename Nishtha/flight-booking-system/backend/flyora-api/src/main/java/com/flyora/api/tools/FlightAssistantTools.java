package com.flyora.api.tools;

import com.flyora.api.dto.response.FlightResponse;
import com.flyora.api.enums.CabinClass;
import com.flyora.api.service.FlightService;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
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

            REQUIRED:
            - departure airport/city
            - destination airport/city
            - travel date

            OPTIONAL:
            - cabin class

            IMPORTANT:
            If the user DOES NOT specify a cabin class,
            search and return flights from ALL cabin classes.

            NEVER assume Economy when the user did not specify
            a cabin class.

            Valid cabin classes:
            ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST.

            The tool searches the actual Flyora PostgreSQL database.
            Never invent flight information.
            """)
    public List<FlightResponse> searchFlights(

            @ToolParam(
                    description = "Departure city or airport code, for example Delhi or DEL",
                    required = true
            )
            String from,

            @ToolParam(
                    description = "Destination city or airport code, for example Bangalore or BLR",
                    required = true
            )
            String to,

            @ToolParam(
                    description = "Travel date in YYYY-MM-DD format",
                    required = true
            )
            LocalDate travelDate,

            @ToolParam(
                    description = """
                            Cabin class requested by the user.
                            Valid values: ECONOMY, PREMIUM_ECONOMY,
                            BUSINESS, FIRST.
                            Leave this parameter EMPTY/null when the
                            user did not specify a cabin class.
                            """,
                    required = false
            )
            CabinClass cabinClass
    ) {

        String normalizedFrom = normalizeAirport(from);
        String normalizedTo = normalizeAirport(to);

        // Get ALL actual flights from the database
        List<FlightResponse> allFlights =
                flightService.getAllFlights();

        return allFlights.stream()

                // Match travel date
                .filter(flight ->
                        flight.getTravelDate() != null
                                && flight.getTravelDate().equals(travelDate)
                )

                // Match departure
                .filter(flight ->
                        normalizeAirport(flight.getFromAirport())
                                .equalsIgnoreCase(normalizedFrom)
                )

                // Match destination
                .filter(flight ->
                        normalizeAirport(flight.getToAirport())
                                .equalsIgnoreCase(normalizedTo)
                )

                // IMPORTANT:
                // Only filter cabin class if the user actually
                // specified one.
                .filter(flight ->
                        cabinClass == null
                                || flight.getCabinClass() == cabinClass
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

            // -------------------------
            // DELHI
            // -------------------------
            case "del",
                 "delhi",
                 "delhi airport",
                 "indira gandhi international airport",
                 "indira gandhi international",
                 "indira gandhi airport" ->
                    "Delhi";


            // -------------------------
            // MUMBAI
            // -------------------------
            case "bom",
                 "mumbai",
                 "mumbai airport",
                 "chhatrapati shivaji maharaj international airport",
                 "chhatrapati shivaji maharaj international",
                 "chhatrapati shivaji airport" ->
                    "Mumbai";


            // -------------------------
            // BANGALORE
            // -------------------------
            case "blr",
                 "bangalore",
                 "bengaluru",
                 "bangalore airport",
                 "kempegowda international airport",
                 "kempegowda airport" ->
                    "Bangalore";


            // -------------------------
            // HYDERABAD
            // -------------------------
            case "hyd",
                 "hyderabad",
                 "hyderabad airport",
                 "rajiv gandhi international airport" ->
                    "Hyderabad";


            // -------------------------
            // CHENNAI
            // -------------------------
            case "maa",
                 "chennai",
                 "chennai airport",
                 "chennai international airport" ->
                    "Chennai";


            // -------------------------
            // KOLKATA
            // -------------------------
            case "ccu",
                 "kolkata",
                 "calcutta",
                 "kolkata airport",
                 "netaji subhas chandra bose international airport" ->
                    "Kolkata";


            // -------------------------
            // PUNE
            // -------------------------
            case "pnq",
                 "pune",
                 "pune airport" ->
                    "Pune";


            // -------------------------
            // GOA
            // -------------------------
            case "goi",
                 "goa",
                 "goa airport",
                 "dabolim airport" ->
                    "Goa";


            // -------------------------
            // DEFAULT
            // -------------------------
            default ->
                    value.substring(0, 1).toUpperCase(Locale.ROOT)
                            + value.substring(1);
        };
    }
}