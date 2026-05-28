package com.withme.service;

import com.withme.model.Reaction;
import java.util.List;

/**
 * ReactionService - Bridge Pattern Abstraction Layer
 * 
 * This interface defines the contract for reaction operations.
 */
public interface ReactionService {
    
    /**
     * Add a reaction to a vent
     * @param userId the user reacting
     * @param ventId the vent ID
     * @param reactionType the reaction type (HEAR_YOU or WARMTH)
     * @return the created reaction
     */
    Reaction addReaction(Long userId, Long ventId, Reaction.ReactionType reactionType);
    
    /**
     * Remove a reaction
     * @param userId the user who reacted
     * @param ventId the vent ID
     * @param reactionType the reaction type
     */
    void removeReaction(Long userId, Long ventId, Reaction.ReactionType reactionType);
    
    /**
     * Get all reactions for a vent
     * @param ventId the vent ID
     * @return list of reactions
     */
    List<Reaction> getVentReactions(Long ventId);
    
    /**
     * Check if user has reacted with a specific type
     * @param userId the user ID
     * @param ventId the vent ID
     * @param reactionType the reaction type
     * @return true if reaction exists
     */
    boolean hasReacted(Long userId, Long ventId, Reaction.ReactionType reactionType);
}
