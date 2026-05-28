package com.withme.repository;

import com.withme.model.Circle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CircleRepository extends JpaRepository<Circle, Long> {
    Page<Circle> findByIsPublicTrue(Pageable pageable);
    Page<Circle> findByTopicOrderByCreatedAtDesc(String topic, Pageable pageable);
}
