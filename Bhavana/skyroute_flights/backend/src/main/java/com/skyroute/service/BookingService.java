package com.skyroute.service;

import com.skyroute.dto.booking.BookingCreateRequest;
import com.skyroute.dto.booking.BookingResponseDto;
import com.skyroute.dto.booking.PassengerDto;
import com.skyroute.dto.flight.FlightResponseDto;
import com.skyroute.entity.*;
import com.skyroute.exception.BookingException;
import com.skyroute.exception.ResourceNotFoundException;
import com.skyroute.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final FlightScheduleRepository scheduleRepository;
    private final FlightSeatRepository seatRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final FlightService flightService;

    @Transactional
    public BookingResponseDto createBooking(BookingCreateRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        FlightSchedule schedule = scheduleRepository.findById(request.getScheduleId())
                .orElseThrow(() -> new ResourceNotFoundException("Flight schedule not found"));

        if (schedule.getAvailableEconomySeats() < request.getPassengers().size()) {
            throw new BookingException("Not enough seats available on this flight.", "SEATS_UNAVAILABLE");
        }

        // Validate and calculate seat surcharge & addons
        BigDecimal totalSeatSurcharge = BigDecimal.ZERO;
        BigDecimal totalAddons = BigDecimal.ZERO;

        for (PassengerDto p : request.getPassengers()) {
            if (p.getSeatNumber() != null && !p.getSeatNumber().isBlank()) {
                FlightSeat seat = seatRepository.findByScheduleIdAndSeatNumber(schedule.getId(), p.getSeatNumber())
                        .orElse(null);
                if (seat != null) {
                    if (Boolean.TRUE.equals(seat.getIsBooked())) {
                        throw new BookingException("Seat " + p.getSeatNumber() + " is already booked.", "SEAT_ALREADY_BOOKED");
                    }
                    seat.setIsBooked(true);
                    seatRepository.save(seat);
                    if (seat.getPriceSurcharge() != null) {
                        totalSeatSurcharge = totalSeatSurcharge.add(seat.getPriceSurcharge());
                    }
                }
            }

            if (Boolean.TRUE.equals(p.getInsuranceOpted())) {
                totalAddons = totalAddons.add(BigDecimal.valueOf(299));
            }
            if (p.getExtraBaggageKg() != null && p.getExtraBaggageKg() > 0) {
                totalAddons = totalAddons.add(BigDecimal.valueOf(p.getExtraBaggageKg() * 450L));
            }
        }

        int passengerCount = request.getPassengers().size();
        BigDecimal baseTotal = schedule.getFlight().getBaseFare().multiply(BigDecimal.valueOf(passengerCount));
        BigDecimal taxTotal = schedule.getFlight().getTaxAmount().multiply(BigDecimal.valueOf(passengerCount));
        BigDecimal finalTotal = baseTotal.add(taxTotal).add(totalSeatSurcharge).add(totalAddons);

        // Generate Unique PNR (6 Alphanumeric characters)
        String pnr = generateUniquePNR();

        Booking booking = Booking.builder()
                .pnr(pnr)
                .user(user)
                .schedule(schedule)
                .bookingStatus("PENDING") // becomes CONFIRMED upon successful payment
                .cabinClass(request.getCabinClass())
                .passengerCount(passengerCount)
                .baseAmount(baseTotal)
                .seatCharges(totalSeatSurcharge)
                .addonCharges(totalAddons)
                .taxAmount(taxTotal)
                .totalAmount(finalTotal)
                .contactEmail(request.getContactEmail())
                .contactPhone(request.getContactPhone())
                .specialRequests(request.getSpecialRequests())
                .build();

        for (PassengerDto pd : request.getPassengers()) {
            Passenger passenger = Passenger.builder()
                    .firstName(pd.getFirstName())
                    .lastName(pd.getLastName())
                    .dateOfBirth(pd.getDateOfBirth())
                    .gender(pd.getGender())
                    .passengerType(pd.getPassengerType())
                    .passportNumber(pd.getPassportNumber())
                    .nationality(pd.getNationality() != null ? pd.getNationality() : "Indian")
                    .seatNumber(pd.getSeatNumber())
                    .mealPreference(pd.getMealPreference())
                    .extraBaggageKg(pd.getExtraBaggageKg() != null ? pd.getExtraBaggageKg() : 0)
                    .insuranceOpted(pd.getInsuranceOpted() != null ? pd.getInsuranceOpted() : false)
                    .build();
            booking.addPassenger(passenger);
        }

        // Deduct inventory
        schedule.setAvailableEconomySeats(schedule.getAvailableEconomySeats() - passengerCount);
        scheduleRepository.save(schedule);

        Booking savedBooking = bookingRepository.save(booking);

        log.info("Created booking PNR: {} for user: {}", pnr, userEmail);
        return mapToDto(savedBooking);
    }

    public List<BookingResponseDto> getUserBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public BookingResponseDto getBookingByPnr(String pnr, String userEmail) {
        Booking booking = bookingRepository.findByPnr(pnr)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found for PNR: " + pnr));

        return mapToDto(booking);
    }

    private String generateUniquePNR() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        SecureRandom random = new SecureRandom();
        String pnr;
        do {
            StringBuilder sb = new StringBuilder(6);
            for (int i = 0; i < 6; i++) {
                sb.append(chars.charAt(random.nextInt(chars.length())));
            }
            pnr = sb.toString();
        } while (bookingRepository.findByPnr(pnr).isPresent());
        return pnr;
    }

    public BookingResponseDto mapToDto(Booking b) {
        FlightResponseDto flightDto = flightService.getFlightDetails(b.getSchedule().getId());
        
        List<PassengerDto> passengers = b.getPassengers().stream().map(p -> PassengerDto.builder()
                .id(p.getId())
                .firstName(p.getFirstName())
                .lastName(p.getLastName())
                .dateOfBirth(p.getDateOfBirth())
                .gender(p.getGender())
                .passengerType(p.getPassengerType())
                .passportNumber(p.getPassportNumber())
                .nationality(p.getNationality())
                .seatNumber(p.getSeatNumber())
                .mealPreference(p.getMealPreference())
                .extraBaggageKg(p.getExtraBaggageKg())
                .insuranceOpted(p.getInsuranceOpted())
                .build()
        ).collect(Collectors.toList());

        boolean isCancellable = "CONFIRMED".equalsIgnoreCase(b.getBookingStatus()) && 
                b.getSchedule().getDepartureDatetime().isAfter(LocalDateTime.now().plusHours(2));

        BigDecimal eligibleRefund = isCancellable ? 
                b.getTotalAmount().subtract(BigDecimal.valueOf(500)).max(BigDecimal.ZERO) : BigDecimal.ZERO;

        return BookingResponseDto.builder()
                .id(b.getId())
                .pnr(b.getPnr())
                .bookingStatus(b.getBookingStatus())
                .cabinClass(b.getCabinClass())
                .passengerCount(b.getPassengerCount())
                .baseAmount(b.getBaseAmount())
                .seatCharges(b.getSeatCharges())
                .addonCharges(b.getAddonCharges())
                .taxAmount(b.getTaxAmount())
                .discountAmount(b.getDiscountAmount())
                .totalAmount(b.getTotalAmount())
                .contactEmail(b.getContactEmail())
                .contactPhone(b.getContactPhone())
                .specialRequests(b.getSpecialRequests())
                .createdAt(b.getCreatedAt())
                .flight(flightDto)
                .passengers(passengers)
                .isCancellable(isCancellable)
                .eligibleRefundAmount(eligibleRefund)
                .build();
    }
}
