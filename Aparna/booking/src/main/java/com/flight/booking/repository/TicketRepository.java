package com.flight.booking.repository;

import com.flight.booking.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    @Query("SELECT t FROM Ticket t JOIN FETCH t.flight JOIN FETCH t.user WHERE t.user.id = :userId ORDER BY t.id DESC")
    List<Ticket> findByUserId(@Param("userId") Long userId);

    @Query("SELECT t FROM Ticket t JOIN FETCH t.flight JOIN FETCH t.user ORDER BY t.bookingTime DESC")
    List<Ticket> findAllOrderByBookingTimeDesc();

    long countByPaymentStatusIgnoreCase(String paymentStatus);

    long countByStatus(String status);

    @Query("SELECT COALESCE(SUM(t.totalPrice), 0) FROM Ticket t")
    java.math.BigDecimal sumTotalPrice();

    @Query("SELECT COALESCE(SUM(t.totalPrice), 0) FROM Ticket t WHERE UPPER(t.paymentStatus) = UPPER(:status)")
    java.math.BigDecimal sumTotalPriceByPaymentStatus(@Param("status") String status);

    @Query("SELECT CAST(t.bookingTime AS java.time.LocalDate), COUNT(t) FROM Ticket t WHERE t.bookingTime >= :since GROUP BY CAST(t.bookingTime AS java.time.LocalDate) ORDER BY CAST(t.bookingTime AS java.time.LocalDate)")
    List<Object[]> countBookingsPerDaySince(@Param("since") LocalDateTime since);

    @Query("SELECT t.flight.fromAirport, t.flight.toAirport, COUNT(t), COALESCE(SUM(t.totalPrice), 0) FROM Ticket t GROUP BY t.flight.fromAirport, t.flight.toAirport ORDER BY COUNT(t) DESC")
    List<Object[]> findPopularRoutes();
}

