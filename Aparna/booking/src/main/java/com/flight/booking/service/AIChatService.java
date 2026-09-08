package com.flight.booking.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.flight.booking.dto.ChatRequest;
import com.flight.booking.dto.ChatResponse;
import com.flight.booking.model.Domain;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIChatService {

    private final KnowledgeService knowledgeService;
    private final DbGroundingService dbGroundingService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${ollama.base-url:http://localhost:11434}")
    private String ollamaBaseUrl;

    @Value("${ollama.model:llama3.2}")
    private String ollamaModel;

    public ChatResponse processChat(ChatRequest request) {
        Domain domain = resolveDomain(request);
        String conversationId = request.getConversationId() != null ? request.getConversationId() : UUID.randomUUID().toString();

        String staticKnowledge = knowledgeService.getKnowledgeForDomain(domain) + "\n\n" + knowledgeService.getFaqForDomain(domain);
        String dbSnapshot = dbGroundingService.buildDbSnapshot(domain, request.getUserId());

        String prompt = buildPrompt(staticKnowledge, dbSnapshot, request.getMessage());

        String answer = callOllama(prompt);
        if (answer == null || answer.isBlank()) {
            answer = generateGroundedAnswer(domain, request.getMessage(), staticKnowledge, dbSnapshot);
        }

        String finalCleanAnswer = cleanAnswer(answer);

        return ChatResponse.builder()
                .conversationId(conversationId)
                .domain(domain)
                .answer(finalCleanAnswer)
                .build();
    }

    private Domain resolveDomain(ChatRequest request) {
        if (request.getDomain() != null) {
            return request.getDomain();
        }
        if (request.getMessage() != null) {
            String msg = request.getMessage().toLowerCase();
            if (msg.contains("cancel") || msg.contains("refund") || msg.contains("ticket") || msg.contains("booking") || msg.contains("pnr") || msg.contains("reschedule")) {
                return Domain.BOOKINGS_TICKETS;
            }
            if (msg.contains("pay") || msg.contains("card") || msg.contains("wallet") || msg.contains("upi") || msg.contains("account") || msg.contains("password") || msg.contains("profile")) {
                return Domain.ACCOUNT_PAYMENTS;
            }
        }
        return Domain.FLIGHTS_SEARCH;
    }

    public String buildPrompt(String staticKnowledge, String dbGrounding, String userMessage) {
        return "SYSTEM INSTRUCTIONS:\n" +
               "You are Meridian AI Assistant, an expert flight booking concierge. Answer the user's question using ONLY the supplied context below.\n" +
               "Explain clearly, concisely, and professionally.\n" +
               "CRITICAL FORMATTING RULES: Do NOT use any emojis. Do NOT use markdown bold asterisks (**) or markdown symbols. Use clean plain text with simple hyphens (-) for lists.\n" +
               "If the user asks about cancellations, explain the cancellation policy: cancellations are free and instant under My Bookings, updating status to CANCELLED and restoring seats to inventory.\n" +
               "If the context is insufficient, explicitly state that you do not have that information.\n" +
               "Never invent a flight number, price, seat count, or booking detail.\n\n" +
               "--- STATIC REFERENCE KNOWLEDGE ---\n" + staticKnowledge + "\n\n" +
               "--- LIVE DATABASE FACTS ---\n" + dbGrounding + "\n\n" +
               "--- USER QUESTION ---\n" + userMessage;
    }

    private String callOllama(String prompt) {
        try {
            HttpClient client = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofMillis(800))
                    .build();

            Map<String, Object> payload = Map.of(
                    "model", ollamaModel,
                    "prompt", prompt,
                    "stream", false
            );

            String requestBody = objectMapper.writeValueAsString(payload);

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(ollamaBaseUrl + "/api/generate"))
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofMillis(1200))
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = client.send(httpRequest, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                if (root.has("response")) {
                    String resp = root.get("response").asText();
                    if (resp != null && !resp.isBlank()) {
                        return resp.trim();
                    }
                }
            }
        } catch (Exception e) {
            log.debug("Ollama fast fallback triggered: {}", e.getMessage());
        }
        return null;
    }

    private String generateGroundedAnswer(Domain domain, String userMsg, String staticKnowledge, String dbSnapshot) {
        if (userMsg == null || userMsg.isBlank()) {
            return "Hello! I am your Meridian AI Assistant. How can I assist you with flights, bookings, or cancellation policies today?";
        }

        String lowerMsg = userMsg.toLowerCase();

        if (lowerMsg.contains("weather") || lowerMsg.contains("hotel") || lowerMsg.contains("car rental") || lowerMsg.contains("crypto")) {
            return "I do not have information regarding that. I am trained specifically on Meridian flights, bookings, ticket policies, and account settings.";
        }

        if (lowerMsg.contains("cancel") || lowerMsg.contains("cancellation") || lowerMsg.contains("refund") || lowerMsg.contains("policy")) {
            return "Meridian Cancellation and Refund Policy:\n\n" +
                   "- How to Cancel: Go to My Bookings, find your upcoming flight card, click the Cancel Booking button, and confirm in the popup modal.\n" +
                   "- Seat Restitution: Upon cancellation, your ticket status changes immediately to CANCELLED and your reserved seats are restored back to the flight inventory for other passengers.\n" +
                   "- Refund Processing: Eligible refunds are processed back to your original payment method within 24 to 48 hours.\n" +
                   "- Protection: Double-cancellations are blocked, and once cancelled, tickets cannot be reinstated.";
        }

        if (lowerMsg.contains("my booking") || lowerMsg.contains("my trip") || lowerMsg.contains("my ticket") || lowerMsg.contains("status")) {
            if (dbSnapshot.contains("Customer is currently not logged in")) {
                return "Please log in to your Meridian account to view your active bookings and trip history.";
            } else if (dbSnapshot.contains("No bookings recorded")) {
                return "You currently have no active flight bookings recorded under your account. You can book flights directly from the Search Flights page.";
            } else {
                int countIdx = dbSnapshot.indexOf("Customer Bookings for User");
                if (countIdx != -1) {
                    String sub = dbSnapshot.substring(countIdx);
                    int endLine = sub.indexOf("\n");
                    String header = endLine != -1 ? sub.substring(0, endLine) : sub;
                    return "Here is your current booking snapshot: " + header + ".\n\nYou can review complete flight times, seat assignments, and manage or cancel your trips under the My Bookings tab.";
                }
                return "Your booking records are available under the My Bookings page.";
            }
        }

        if (lowerMsg.contains("baggage") || lowerMsg.contains("luggage") || lowerMsg.contains("weight") || lowerMsg.contains("bag")) {
            return "Baggage Allowance Policy:\n\n" +
                   "- Cabin Baggage: 1 piece up to 7 kg plus 1 small personal item (laptop bag or purse) free of charge.\n" +
                   "- Checked Baggage: 1 standard bag up to 15 kg (domestic) or 23 kg (international) included in standard economy fares.\n" +
                   "- Extra Baggage: Additional weight can be added during seat selection or at the airport check-in counter.";
        }

        if (lowerMsg.contains("flight") || lowerMsg.contains("search") || lowerMsg.contains("seat") || lowerMsg.contains("route")) {
            return "Meridian Flight Network and Search:\n\n" +
                   "- We operate daily direct and connecting flights across major domestic and international hubs including Delhi (DEL), Mumbai (BOM), Bengaluru (BLR), London (LHR), and New York (JFK).\n" +
                   "- Use our Search Flights page to filter by departure time, price slider, non-stop vs connecting, and preferred airline partners.\n" +
                   "- Interactive seat selection is available in Step 2 of the booking process.";
        }

        if (lowerMsg.contains("payment") || lowerMsg.contains("card") || lowerMsg.contains("upi")) {
            return "Payment Options:\n\n" +
                   "- We support Credit Cards, Debit Cards, UPI, and Net Banking in our secure checkout sandbox.\n" +
                   "- Test transactions generate a synthetic confirmation reference and issue an immediate electronic ticket.";
        }

        return "Based on Meridian reference records: You can search flights across our network, choose cabin classes and seat preferences, and manage or cancel bookings directly from your account dashboard.";
    }

    private String cleanAnswer(String text) {
        if (text == null) return "";
        // Remove markdown bold/italic asterisks
        String cleaned = text.replace("**", "").replace("*", "");
        // Safely strip emojis without invalid regex class
        StringBuilder sb = new StringBuilder();
        cleaned.codePoints().forEach(cp -> {
            if (cp < 0x1F000 && (cp < 0x2600 || cp > 0x27BF)) {
                sb.appendCodePoint(cp);
            }
        });
        cleaned = sb.toString().replace("•", "-");
        return cleaned.trim();
    }
}
