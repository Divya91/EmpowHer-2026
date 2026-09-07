package com.flight.booking.service.impl;

import com.flight.booking.dto.request.ChatRequestDTO;
import com.flight.booking.dto.response.BookingResponseDTO;
import com.flight.booking.dto.response.ChatResponseDTO;
import com.flight.booking.dto.response.FlightResponseDTO;
import com.flight.booking.dto.search.FlightSearchCriteria;
import com.flight.booking.entity.Airport;
import com.flight.booking.entity.Booking;
import com.flight.booking.entity.Flight;
import com.flight.booking.entity.User;
import com.flight.booking.mapper.FlightMapper;
import com.flight.booking.repository.AirportRepository;
import com.flight.booking.repository.BookingRepository;
import com.flight.booking.repository.FlightRepository;
import com.flight.booking.repository.UserRepository;
import com.flight.booking.service.ChatService;
import com.flight.booking.specification.FlightSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final FlightRepository flightRepository;
    private final AirportRepository airportRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final FlightMapper flightMapper;

    private static final List<String> DEFAULT_SUGGESTIONS = List.of(
            "How do I search flights?",
            "What airport codes can I use?",
            "How to pay?",
            "Show my bookings"
    );

    @Override
    public ChatResponseDTO chat(ChatRequestDTO request, String userEmailOrNull) {
        String msg = request.getMessage().trim().toLowerCase(Locale.ROOT);

        if (isGreeting(msg)) {
            return reply(
                    "Hello! I'm SkyBot, your SkySafar assistant. I can help you search flights, book tickets, payment info, and track your bookings. What would you like to know?",
                    List.of("Search DEL to BOM", "Payment methods", "Demo login", "My bookings")
            );
        }

        if (msg.contains("demo") && (msg.contains("login") || msg.contains("password") || msg.contains("account"))) {
            return reply(
                    "Demo account:\n• Email: demo@example.com\n• Password: password123\n\nSign in at the login page, then search and book flights!",
                    List.of("How to book?", "Airport codes")
            );
        }

        if (msg.contains("airport") || msg.contains("code") || msg.contains("cities")) {
            return reply(buildAirportList(), List.of("Search DEL to BOM", "Cheapest flight"));
        }

        if (msg.contains("search") || msg.contains("find flight") || msg.contains("how to book")) {
            return reply(
                    "To search flights on SkySafar:\n1. Sign in to your account\n2. Enter From/To airport codes (e.g. DEL, BOM)\n3. Pick a date and number of travellers\n4. Click Search Flights\n5. Use filters for airline, budget & sort\n6. Click Select → pay via Card or UPI",
                    List.of("Airport codes", "Payment methods", "Show my bookings")
            );
        }

        if (msg.contains("pay") || msg.contains("upi") || msg.contains("card")) {
            return reply(
                    "SkySafar accepts:\n• Credit/Debit Card — enter card number, name, expiry & CVV\n• UPI — enter your UPI ID (e.g. name@upi)\n\nPayment is simulated for this project. Card details are never stored — only the last 4 digits are saved.",
                    List.of("How to book?", "Cancellation policy")
            );
        }

        if (msg.contains("cancel")) {
            return reply(
                    "To cancel a booking, go to My Bookings and click Cancel on the ticket. Refunds are processed within 5–7 business days (simulated). Direct flights cancelled 24+ hours before departure get full refund.",
                    List.of("Show my bookings", "Contact support")
            );
        }

        if (msg.contains("support") || msg.contains("contact") || msg.contains("help")) {
            return reply(
                    "SkySafar Support:\n• Email: support@skysafar.com\n• Phone: 1800-SKY-SAFAR\n• Hours: 24/7\n\nI'm also here to answer questions anytime!",
                    DEFAULT_SUGGESTIONS
            );
        }

        if (msg.contains("my booking") || msg.contains("my ticket") || msg.contains("show booking")) {
            return replyWithBookings(userEmailOrNull);
        }

        if (msg.contains("cheapest") || msg.contains("lowest price") || msg.contains("best deal")) {
            FlightSearchCriteria criteria = parseRouteFromMessage(msg);
            return replyWithCheapestFlight(criteria);
        }

        Matcher routeMatcher = Pattern.compile("\\b([a-z]{3})\\b.*\\b([a-z]{3})\\b").matcher(msg);
        if (routeMatcher.find()) {
            String from = routeMatcher.group(1).toUpperCase();
            String to = routeMatcher.group(2).toUpperCase();
            if (isValidAirport(from) && isValidAirport(to)) {
                return replyWithFlightsForRoute(from, to);
            }
        }

        if (msg.contains("jwt") || msg.contains("login") || msg.contains("sign in") || msg.contains("signup") || msg.contains("register")) {
            return reply(
                    "Authentication on SkySafar uses JWT tokens. Sign up with your name & email, then login to get a token. All booking APIs require you to be logged in. Your session stays active until you sign out.",
                    List.of("Demo login", "How to book?")
            );
        }

        if (msg.contains("thank")) {
            return reply("You're welcome! Have a safe flight with SkySafar ✈", List.of("Search flights", "My bookings"));
        }

        return reply(
                "I'm not sure about that. Try asking about:\n• Flight search (e.g. 'flights from DEL to BOM')\n• Airport codes\n• Payment (Card/UPI)\n• My bookings\n• Demo login",
                DEFAULT_SUGGESTIONS
        );
    }

    private ChatResponseDTO replyWithBookings(String userEmail) {
        if (userEmail == null || userEmail.isBlank()) {
            return reply(
                    "Please sign in first to view your bookings. Go to Login, then ask me again or visit My Bookings from the menu.",
                    List.of("Demo login", "How to book?")
            );
        }

        User user = userRepository.findByEmail(userEmail).orElse(null);
        if (user == null) {
            return reply("I couldn't find your account. Please sign in again.", List.of("Demo login"));
        }

        List<Booking> bookings = bookingRepository.findByUserOrderByBookedAtDesc(user);
        if (bookings.isEmpty()) {
            return reply(
                    "You have no bookings yet. Search for a flight and complete payment to book!",
                    List.of("Search DEL to BOM", "How to book?")
            );
        }

        StringBuilder sb = new StringBuilder("Your bookings:\n");
        for (Booking b : bookings) {
            Flight f = b.getFlight();
            sb.append(String.format("• %s — %s→%s, %d pax, ₹%.0f (%s)\n",
                    b.getBookingReference(),
                    f.getFromAirport().getAirportCode(),
                    f.getToAirport().getAirportCode(),
                    b.getPassengers(),
                    b.getTotalAmount(),
                    b.getStatus()));
        }
        return reply(sb.toString().trim(), List.of("Search more flights", "Cancellation policy"));
    }

    private ChatResponseDTO replyWithFlightsForRoute(String from, String to) {
        FlightSearchCriteria criteria = FlightSearchCriteria.builder()
                .fromAirport(from)
                .toAirport(to)
                .build();

        Specification<Flight> spec = FlightSpecification.searchFlights(criteria);
        List<Flight> flights = flightRepository.findAll(spec);

        if (flights.isEmpty()) {
            return reply(
                    String.format("No flights found for %s → %s right now. Try other dates or nearby airports.", from, to),
                    List.of("Airport codes", "Show all routes")
            );
        }

        StringBuilder sb = new StringBuilder(String.format("Flights %s → %s:\n", from, to));
        flights.stream().limit(5).forEach(f -> {
            FlightResponseDTO dto = flightMapper.toResponseDTO(f);
            sb.append(String.format("• %s — ₹%.0f, %d min, %s\n",
                    dto.getAirlineName(),
                    dto.getBasePrice(),
                    dto.getDurationMinutes(),
                    dto.getStops() == 0 ? "Direct" : dto.getStops() + " stop(s)"));
        });
        sb.append("\nSign in and search on the home page to book!");
        return reply(sb.toString().trim(), List.of("Cheapest flight", "How to pay?"));
    }

    private ChatResponseDTO replyWithCheapestFlight(FlightSearchCriteria criteria) {
        Specification<Flight> spec = FlightSpecification.searchFlights(criteria);
        List<Flight> flights = flightRepository.findAll(spec);

        if (flights.isEmpty()) {
            flights = flightRepository.findAll();
        }

        Flight cheapest = flights.stream()
                .min((a, b) -> a.getBasePrice().compareTo(b.getBasePrice()))
                .orElse(null);

        if (cheapest == null) {
            return reply("No flights available at the moment.", DEFAULT_SUGGESTIONS);
        }

        FlightResponseDTO dto = flightMapper.toResponseDTO(cheapest);
        return reply(
                String.format("Best deal right now:\n• %s → %s\n• %s (%s)\n• ₹%.0f per person, %d min\n• %s",
                        dto.getFromAirport(), dto.getToAirport(),
                        dto.getAirlineName(), dto.getAirlineCode(),
                        dto.getBasePrice(), dto.getDurationMinutes(),
                        dto.getStops() == 0 ? "Direct" : dto.getStops() + " stop(s)"),
                List.of("Search this route", "How to book?")
        );
    }

    private FlightSearchCriteria parseRouteFromMessage(String msg) {
        Matcher m = Pattern.compile("\\b([a-z]{3})\\b.*\\b([a-z]{3})\\b").matcher(msg);
        if (m.find()) {
            return FlightSearchCriteria.builder()
                    .fromAirport(m.group(1).toUpperCase())
                    .toAirport(m.group(2).toUpperCase())
                    .build();
        }
        return FlightSearchCriteria.builder().build();
    }

    private String buildAirportList() {
        List<Airport> airports = airportRepository.findAll();
        StringBuilder sb = new StringBuilder("SkySafar airport codes:\n");
        for (Airport a : airports) {
            sb.append(String.format("• %s — %s (%s)\n", a.getAirportCode(), a.getCity(), a.getName()));
        }
        return sb.toString().trim();
    }

    private boolean isValidAirport(String code) {
        return airportRepository.findById(code).isPresent();
    }

    private boolean isGreeting(String msg) {
        return msg.matches("^(hi|hello|hey|good morning|good evening|namaste).*") || msg.equals("hi") || msg.equals("hello");
    }

    private ChatResponseDTO reply(String text, List<String> suggestions) {
        return ChatResponseDTO.builder()
                .reply(text)
                .suggestions(suggestions)
                .build();
    }
}
