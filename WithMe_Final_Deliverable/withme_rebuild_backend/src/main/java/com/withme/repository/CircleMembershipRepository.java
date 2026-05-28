package com.withme.repository;

import com.withme.model.CircleMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CircleMembershipRepository extends JpaRepository<CircleMembership, Long> {
    Optional<CircleMembership> findByUserIdAndCircleId(Long userId, Long circleId);
    List<CircleMembership> findByUserId(Long userId);
    List<CircleMembership> findByCircleId(Long circleId);
    void deleteByUserIdAndCircleId(Long userId, Long circleId);
}
