package com.skyroute.repository;

import com.skyroute.entity.Refund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RefundRepository extends JpaRepository<Refund, Long> {
    Optional<Refund> findByCancellationId(Long cancellationId);
    List<Refund> findByRefundStatus(String refundStatus);
    List<Refund> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Refund> findAllByOrderByCreatedAtDesc();
}
