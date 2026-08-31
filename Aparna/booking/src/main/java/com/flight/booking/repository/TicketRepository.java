package com.flight.booking.repository;

import com.flight.booking.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    @Query("SELECT t FROM Ticket t JOIN FETCH t.flight JOIN FETCH t.user WHERE t.user.id = :userId ORDER BY t.id DESC")
    List<Ticket> findByUserId(@Param("userId") Long userId);
}
