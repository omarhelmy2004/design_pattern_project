package com.withme.repository;

import com.withme.model.Vent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VentRepository extends JpaRepository<Vent, Long> {
    Page<Vent> findByCircleIsNullOrderByCreatedAtDesc(Pageable pageable);
    Page<Vent> findByCircleIdOrderByCreatedAtDesc(Long circleId, Pageable pageable);
    Page<Vent> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
}
