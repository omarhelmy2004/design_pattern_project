package com.withme.repository;

import com.withme.model.CheckIn;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface CheckInRepository extends JpaRepository<CheckIn, Long> {
    Page<CheckIn> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    Optional<CheckIn> findTopByUserIdOrderByCreatedAtDesc(Long userId);
    long countByUserIdAndCreatedAtAfter(Long userId, LocalDateTime dateTime);
}
