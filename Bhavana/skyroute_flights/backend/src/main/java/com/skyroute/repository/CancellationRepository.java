package com.skyroute.repository;

import com.skyroute.entity.Cancellation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CancellationRepository extends JpaRepository<Cancellation, Long> {
    Optional<Cancellation> findByBookingId(Long bookingId);
    List<Cancellation> findByUserIdOrderByCreatedAtDesc(Long userId);
}
