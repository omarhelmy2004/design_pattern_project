package com.withme.repository;

import com.withme.model.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    List<Reaction> findByVentId(Long ventId);
    Optional<Reaction> findByUserIdAndVentIdAndReactionType(Long userId, Long ventId, Reaction.ReactionType reactionType);
    void deleteByUserIdAndVentIdAndReactionType(Long userId, Long ventId, Reaction.ReactionType reactionType);
}
