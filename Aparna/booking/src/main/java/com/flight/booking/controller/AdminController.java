package com.flight.booking.controller;

import com.flight.booking.entity.Flight;
import com.flight.booking.entity.Ticket;
import com.flight.booking.entity.User;
import com.flight.booking.repository.FlightRepository;
import com.flight.booking.repository.TicketRepository;
import com.flight.booking.repository.UserRepository;
import com.flight.booking.service.FlightService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final FlightRepository flightRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final FlightService flightService;
    private final com.flight.booking.service.TicketService ticketService;

    @GetMapping("/overview")
    public Map<String, Object> getOverview() {
        Map<String, Object> overview = new LinkedHashMap<>();

        // --- Real booking counts ---
        long totalBookings = ticketRepository.count();
        overview.put("totalBookings", totalBookings);

        // Week-over-week growth: compare last 7 days vs previous 7 days
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime sevenDaysAgo = now.minusDays(7);
        LocalDateTime fourteenDaysAgo = now.minusDays(14);

        List<Object[]> last30DaysData = ticketRepository.countBookingsPerDaySince(now.minusDays(30));

        long thisWeekBookings = 0;
        long lastWeekBookings = 0;
        LocalDate todayDate = LocalDate.now();
        for (Object[] row : last30DaysData) {
            LocalDate date = (LocalDate) row[0];
            long count = ((Number) row[1]).longValue();
            if (!date.isBefore(todayDate.minusDays(7))) {
                thisWeekBookings += count;
            } else if (!date.isBefore(todayDate.minusDays(14))) {
                lastWeekBookings += count;
            }
        }

        String wowGrowth;
        if (lastWeekBookings > 0) {
            double pct = ((double) (thisWeekBookings - lastWeekBookings) / lastWeekBookings) * 100;
            wowGrowth = (pct >= 0 ? "+" : "") + String.format("%.0f", pct) + "%";
        } else if (thisWeekBookings > 0) {
            wowGrowth = "+100%";
        } else {
            wowGrowth = "0%";
        }
        overview.put("weekOverWeekGrowth", wowGrowth);

        // --- Real revenue data ---
        BigDecimal grossRevenue = ticketRepository.sumTotalPrice();
        if (grossRevenue == null) grossRevenue = BigDecimal.ZERO;
        overview.put("grossRevenue", grossRevenue);

        // Monthly target: set based on current revenue or a reasonable threshold
        BigDecimal monthlyTarget = grossRevenue.compareTo(BigDecimal.ZERO) > 0
                ? grossRevenue.multiply(BigDecimal.valueOf(1.3)).setScale(0, RoundingMode.CEILING)
                : BigDecimal.valueOf(500000);
        overview.put("monthlyRevenueTarget", monthlyTarget);

        double progressPercent = monthlyTarget.compareTo(BigDecimal.ZERO) > 0
                ? grossRevenue.divide(monthlyTarget, 4, RoundingMode.HALF_UP).doubleValue() * 100
                : 0;
        overview.put("monthlyProgressPercent", Math.round(progressPercent * 100.0) / 100.0);

        // --- Active flights in the air: flights departing before now with arrival after now ---
        List<Flight> allFlights = flightRepository.findAll();
        long activeFlightsInAir = allFlights.stream()
                .filter(f -> f.getDepartureTs() != null && f.getArrivalTs() != null)
                .filter(f -> f.getDepartureTs().isBefore(now) && f.getArrivalTs().isAfter(now))
                .count();
        overview.put("activeFlightsInAir", activeFlightsInAir);

        // --- Pending refund requests ---
        long pendingRefunds = ticketRepository.countByPaymentStatusIgnoreCase("REFUNDED")
                + ticketRepository.countByPaymentStatusIgnoreCase("PENDING");
        overview.put("pendingRefundRequests", pendingRefunds);

        // --- 30-day booking trends (from real DB) ---
        List<Map<String, Object>> trends = new ArrayList<>();
        Map<LocalDate, Long> dayCountMap = new LinkedHashMap<>();
        for (Object[] row : last30DaysData) {
            LocalDate date = (LocalDate) row[0];
            long count = ((Number) row[1]).longValue();
            dayCountMap.put(date, count);
        }
        // Fill in zero days for the past 30 days
        for (int i = 29; i >= 0; i--) {
            LocalDate d = todayDate.minusDays(i);
            Map<String, Object> point = new LinkedHashMap<>();
            point.put("date", d.toString());
            point.put("bookings", dayCountMap.getOrDefault(d, 0L));
            trends.add(point);
        }
        overview.put("bookingTrends30d", trends);

        // --- Popular routes (from real DB) ---
        List<Object[]> routeData = ticketRepository.findPopularRoutes();
        List<Map<String, Object>> popularRoutes = new ArrayList<>();
        long maxVol = routeData.isEmpty() ? 1 : ((Number) routeData.get(0)[2]).longValue();
        if (maxVol == 0) maxVol = 1;

        for (Object[] row : routeData) {
            String from = (String) row[0];
            String to = (String) row[1];
            long vol = ((Number) row[2]).longValue();
            BigDecimal rev = (BigDecimal) row[3];

            Map<String, Object> route = new LinkedHashMap<>();
            route.put("route", from + " to " + to);
            route.put("origin", from);
            route.put("destination", to);
            route.put("volume", vol);
            route.put("revenue", "\u20b9" + rev.setScale(0, RoundingMode.HALF_UP).toPlainString());
            route.put("percentage", Math.round((double) vol / maxVol * 100));

            // Compute load factor: seats booked / total capacity for this route
            long totalSeatsOnRoute = allFlights.stream()
                    .filter(f -> f.getFromAirport().equalsIgnoreCase(from) && f.getToAirport().equalsIgnoreCase(to))
                    .mapToLong(f -> f.getSeatsLeft() + vol) // rough approximation
                    .sum();
            if (totalSeatsOnRoute > 0) {
                route.put("loadFactor", Math.min(99, Math.round((double) vol / totalSeatsOnRoute * 100)) + "%");
            } else {
                route.put("loadFactor", "N/A");
            }

            popularRoutes.add(route);
            if (popularRoutes.size() >= 5) break;
        }
        overview.put("popularRoutes", popularRoutes);

        // --- 5 most recent bookings (from real DB) ---
        List<Ticket> allTickets = ticketRepository.findAllOrderByBookingTimeDesc();
        List<Map<String, Object>> recentBookings = new ArrayList<>();
        int count = 0;
        for (Ticket t : allTickets) {
            if (count >= 5) break;
            Map<String, Object> booking = new LinkedHashMap<>();
            booking.put("id", t.getId());
            booking.put("bookingId", t.getBookingCode() != null ? t.getBookingCode() : "BK-" + t.getId());
            booking.put("passengerName", t.getUser().getName() + (t.getUser().getLastName() != null ? " " + t.getUser().getLastName() : ""));
            booking.put("route", t.getFlight().getFromAirport() + " to " + t.getFlight().getToAirport());
            booking.put("flightNumber", t.getFlight().getFlightNumber());

            // Determine flight status based on times
            String flightStatus = "Scheduled";
            if (t.getFlight().getDepartureTs() != null && t.getFlight().getArrivalTs() != null) {
                if (t.getFlight().getDepartureTs().isBefore(now) && t.getFlight().getArrivalTs().isAfter(now)) {
                    flightStatus = "In-Air";
                } else if (t.getFlight().getDepartureTs().isBefore(now) && t.getFlight().getArrivalTs().isBefore(now)) {
                    flightStatus = "Landed";
                }
            }
            booking.put("flightStatus", flightStatus);

            String paymentStatus = t.getPaymentStatus() != null ? t.getPaymentStatus() : "Pending";
            // Normalize
            if (paymentStatus.equalsIgnoreCase("CONFIRMED") || paymentStatus.equalsIgnoreCase("PAID") || paymentStatus.equalsIgnoreCase("SUCCESS")) {
                paymentStatus = "Paid";
            } else if (paymentStatus.equalsIgnoreCase("REFUNDED") || paymentStatus.equalsIgnoreCase("CANCELLED")) {
                paymentStatus = "Refunded";
            } else {
                paymentStatus = "Pending";
            }
            booking.put("paymentStatus", paymentStatus);

            booking.put("amount", t.getTotalPrice());

            // Relative time
            if (t.getBookingTime() != null) {
                long minsAgo = ChronoUnit.MINUTES.between(t.getBookingTime(), now);
                if (minsAgo < 1) {
                    booking.put("bookedAt", "Just now");
                } else if (minsAgo < 60) {
                    booking.put("bookedAt", minsAgo + " mins ago");
                } else if (minsAgo < 1440) {
                    booking.put("bookedAt", (minsAgo / 60) + " hours ago");
                } else {
                    booking.put("bookedAt", (minsAgo / 1440) + " days ago");
                }
            } else {
                booking.put("bookedAt", "N/A");
            }

            recentBookings.add(booking);
            count++;
        }
        overview.put("recentBookings", recentBookings);

        // --- Total flights and users for context ---
        overview.put("totalFlights", allFlights.size());
        overview.put("totalUsers", userRepository.count());

        return overview;
    }

    @GetMapping("/bookings")
    public List<Map<String, Object>> getAllBookings() {
        LocalDateTime now = LocalDateTime.now();
        List<Ticket> tickets = ticketRepository.findAllOrderByBookingTimeDesc();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Ticket t : tickets) {
            Map<String, Object> booking = new LinkedHashMap<>();
            booking.put("id", t.getId());
            booking.put("bookingId", t.getBookingCode() != null ? t.getBookingCode() : "BK-" + t.getId());
            booking.put("passengerName", t.getUser().getName() + (t.getUser().getLastName() != null ? " " + t.getUser().getLastName() : ""));
            booking.put("route", t.getFlight().getFromAirport() + " to " + t.getFlight().getToAirport());
            booking.put("flightNumber", t.getFlight().getFlightNumber());

            String flightStatus = "Scheduled";
            if (t.getFlight().getDepartureTs() != null && t.getFlight().getArrivalTs() != null) {
                if (t.getFlight().getDepartureTs().isBefore(now) && t.getFlight().getArrivalTs().isAfter(now)) {
                    flightStatus = "In-Air";
                } else if (t.getFlight().getDepartureTs().isBefore(now)) {
                    flightStatus = "Landed";
                }
            }
            booking.put("flightStatus", flightStatus);

            String paymentStatus = t.getPaymentStatus() != null ? t.getPaymentStatus() : "Pending";
            if (paymentStatus.equalsIgnoreCase("CONFIRMED") || paymentStatus.equalsIgnoreCase("PAID") || paymentStatus.equalsIgnoreCase("SUCCESS")) {
                paymentStatus = "Paid";
            } else if (paymentStatus.equalsIgnoreCase("REFUNDED") || paymentStatus.equalsIgnoreCase("CANCELLED")) {
                paymentStatus = "Refunded";
            } else {
                paymentStatus = "Pending";
            }
            booking.put("paymentStatus", paymentStatus);
            booking.put("amount", t.getTotalPrice());

            if (t.getBookingTime() != null) {
                long minsAgo = ChronoUnit.MINUTES.between(t.getBookingTime(), now);
                if (minsAgo < 1) booking.put("bookedAt", "Just now");
                else if (minsAgo < 60) booking.put("bookedAt", minsAgo + " mins ago");
                else if (minsAgo < 1440) booking.put("bookedAt", (minsAgo / 60) + " hours ago");
                else booking.put("bookedAt", (minsAgo / 1440) + " days ago");
            } else {
                booking.put("bookedAt", "N/A");
            }

            result.add(booking);
        }

        return result;
    }

    @GetMapping("/routes")
    public List<Map<String, Object>> getRoutes() {
        List<Flight> flights = flightRepository.findAll();
        List<Map<String, Object>> routes = new ArrayList<>();
        int routeNum = 100;

        for (Flight f : flights) {
            routeNum++;
            Map<String, Object> route = new LinkedHashMap<>();
            route.put("flightId", f.getFlightId());
            route.put("routeId", "RT-" + routeNum);
            route.put("flightNumber", f.getFlightNumber());
            route.put("origin", f.getFromAirport());
            route.put("destination", f.getToAirport());
            route.put("aircraft", f.getAircraft() != null ? f.getAircraft() : "N/A");
            route.put("dailyFrequency", 1);
            route.put("status", f.getSeatsLeft() > 0 ? "Active" : "Full");
            route.put("capacity", f.getSeatsLeft() + " Seats Left");
            route.put("basePrice", f.getBasePrice());
            route.put("departureTs", f.getDepartureTs());
            route.put("arrivalTs", f.getArrivalTs());
            routes.add(route);
        }

        return routes;
    }

    @GetMapping("/users")
    public List<Map<String, Object>> getUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (User u : users) {
            Map<String, Object> userMap = new LinkedHashMap<>();
            userMap.put("userId", "USR-" + u.getId());
            userMap.put("name", u.getName() + (u.getLastName() != null ? " " + u.getLastName() : ""));
            userMap.put("email", u.getEmail());
            userMap.put("role", u.getRole() != null ? u.getRole().name() : "CUSTOMER");
            userMap.put("status", "Active");
            result.add(userMap);
        }

        return result;
    }

    @GetMapping("/finance")
    public Map<String, Object> getFinance() {
        Map<String, Object> finance = new LinkedHashMap<>();

        BigDecimal totalRevenue = ticketRepository.sumTotalPrice();
        if (totalRevenue == null) totalRevenue = BigDecimal.ZERO;
        finance.put("totalRevenue", totalRevenue);

        BigDecimal paidRevenue = ticketRepository.sumTotalPriceByPaymentStatus("PAID");
        if (paidRevenue == null || paidRevenue.compareTo(BigDecimal.ZERO) == 0) {
            BigDecimal confirmedRevenue = ticketRepository.sumTotalPriceByPaymentStatus("CONFIRMED");
            if (confirmedRevenue != null && confirmedRevenue.compareTo(BigDecimal.ZERO) > 0) {
                paidRevenue = confirmedRevenue;
            }
        }
        if (paidRevenue == null) paidRevenue = BigDecimal.ZERO;
        finance.put("paidRevenue", paidRevenue);

        BigDecimal refundedRevenue = ticketRepository.sumTotalPriceByPaymentStatus("REFUNDED");
        if (refundedRevenue == null) refundedRevenue = BigDecimal.ZERO;

        BigDecimal pendingRevenue = ticketRepository.sumTotalPriceByPaymentStatus("PENDING");
        if (pendingRevenue == null) pendingRevenue = BigDecimal.ZERO;

        long totalTxns = ticketRepository.count();
        long paidTxns = ticketRepository.countByPaymentStatusIgnoreCase("CONFIRMED")
                + ticketRepository.countByPaymentStatusIgnoreCase("PAID")
                + ticketRepository.countByPaymentStatusIgnoreCase("SUCCESS");
        long pendingTxns = ticketRepository.countByPaymentStatusIgnoreCase("PENDING");
        long refundedTxns = ticketRepository.countByPaymentStatusIgnoreCase("REFUNDED")
                + ticketRepository.countByPaymentStatusIgnoreCase("CANCELLED");

        List<Map<String, Object>> channels = new ArrayList<>();

        Map<String, Object> paidChannel = new LinkedHashMap<>();
        paidChannel.put("category", "Paid Bookings");
        paidChannel.put("volume", paidTxns);
        paidChannel.put("amount", paidRevenue);
        paidChannel.put("sharePercent", totalTxns > 0 ? Math.round((double) paidTxns / totalTxns * 1000) / 10.0 : 0);
        paidChannel.put("status", "Settled");
        channels.add(paidChannel);

        Map<String, Object> pendingChannel = new LinkedHashMap<>();
        pendingChannel.put("category", "Pending Bookings");
        pendingChannel.put("volume", pendingTxns);
        pendingChannel.put("amount", pendingRevenue);
        pendingChannel.put("sharePercent", totalTxns > 0 ? Math.round((double) pendingTxns / totalTxns * 1000) / 10.0 : 0);
        pendingChannel.put("status", "Processing");
        channels.add(pendingChannel);

        Map<String, Object> refundChannel = new LinkedHashMap<>();
        refundChannel.put("category", "Refunded / Cancelled");
        refundChannel.put("volume", refundedTxns);
        refundChannel.put("amount", refundedRevenue);
        refundChannel.put("sharePercent", totalTxns > 0 ? Math.round((double) refundedTxns / totalTxns * 1000) / 10.0 : 0);
        refundChannel.put("status", "Held");
        channels.add(refundChannel);

        finance.put("channels", channels);

        return finance;
    }

    @PostMapping("/bookings/{ticketId}/refund")
    public Map<String, Object> refundBooking(@PathVariable Long ticketId) {
        ticketService.cancelTicket(ticketId, null);
        Map<String, Object> res = new HashMap<>();
        res.put("status", "success");
        res.put("message", "Ticket " + ticketId + " refunded successfully");
        return res;
    }

    @PostMapping("/routes/{flightId}/toggle")
    public Map<String, Object> toggleFlight(@PathVariable Long flightId) {
        flightRepository.findById(flightId).ifPresent(flight -> {
            if (flight.getSeatsLeft() > 0) {
                flight.setSeatsLeft(0);
            } else {
                flight.setSeatsLeft(150);
            }
            flightRepository.save(flight);
        });
        Map<String, Object> res = new HashMap<>();
        res.put("status", "success");
        return res;
    }
}
