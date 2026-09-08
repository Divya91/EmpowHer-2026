package com.skyroute;

import com.skyroute.dto.booking.BookingCreateRequest;
import com.skyroute.dto.booking.BookingResponseDto;
import com.skyroute.dto.booking.PassengerDto;
import com.skyroute.entity.Airline;
import com.skyroute.entity.Airport;
import com.skyroute.entity.Flight;
import com.skyroute.entity.FlightSchedule;
import com.skyroute.entity.User;
import com.skyroute.repository.BookingRepository;
import com.skyroute.repository.FlightScheduleRepository;
import com.skyroute.repository.FlightSeatRepository;
import com.skyroute.repository.NotificationRepository;
import com.skyroute.repository.UserRepository;
import com.skyroute.service.BookingService;
import com.skyroute.service.FlightService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private FlightScheduleRepository scheduleRepository;

    @Mock
    private FlightSeatRepository seatRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private FlightService flightService;

    @InjectMocks
    private BookingService bookingService;

    private User testUser;
    private FlightSchedule testSchedule;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@skyroute.com")
                .fullName("Test User")
                .phoneNumber("+91 9999999999")
                .build();

        Airport origin = Airport.builder().iataCode("BLR").city("Bengaluru").name("Kempegowda Intl").build();
        Airport dest = Airport.builder().iataCode("DEL").city("New Delhi").name("Indira Gandhi Intl").build();
        Airline airline = Airline.builder().name("IndiGo").iataCode("6E").build();

        Flight flight = Flight.builder()
                .id(1L)
                .flightNumber("6E-101")
                .airline(airline)
                .originAirport(origin)
                .destinationAirport(dest)
                .departureTime(LocalTime.of(8, 0))
                .arrivalTime(LocalTime.of(10, 45))
                .durationMinutes(165)
                .baseFare(BigDecimal.valueOf(5000))
                .taxAmount(BigDecimal.valueOf(600))
                .build();

        testSchedule = FlightSchedule.builder()
                .id(100L)
                .flight(flight)
                .scheduledDepartureDate(LocalDate.now().plusDays(5))
                .departureDatetime(LocalDateTime.now().plusDays(5))
                .arrivalDatetime(LocalDateTime.now().plusDays(5).plusMinutes(165))
                .availableEconomySeats(120)
                .build();
    }

    @Test
    @DisplayName("Should successfully create a flight booking with unique PNR and calculate pricing")
    void testCreateBookingSuccess() {
        when(userRepository.findByEmail("test@skyroute.com")).thenReturn(Optional.of(testUser));
        when(scheduleRepository.findById(100L)).thenReturn(Optional.of(testSchedule));
        when(bookingRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        PassengerDto passenger = PassengerDto.builder()
                .firstName("John")
                .lastName("Doe")
                .dateOfBirth(LocalDate.of(1995, 5, 12))
                .gender("MALE")
                .seatNumber("14A")
                .insuranceOpted(true)
                .build();

        BookingCreateRequest request = BookingCreateRequest.builder()
                .scheduleId(100L)
                .cabinClass("ECONOMY")
                .passengers(List.of(passenger))
                .contactEmail("test@skyroute.com")
                .contactPhone("+91 9999999999")
                .build();

        BookingResponseDto response = bookingService.createBooking(request, "test@skyroute.com");

        assertNotNull(response);
        assertNotNull(response.getPnr());
        assertEquals(6, response.getPnr().length());
        assertEquals("PENDING", response.getBookingStatus());
        verify(bookingRepository, times(1)).save(any());
    }
}
