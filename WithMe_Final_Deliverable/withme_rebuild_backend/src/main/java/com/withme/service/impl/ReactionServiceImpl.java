package com.withme.service.impl;

import com.withme.model.Reaction;
import com.withme.model.User;
import com.withme.model.Vent;
import com.withme.repository.ReactionRepository;
import com.withme.repository.UserRepository;
import com.withme.repository.VentRepository;
import com.withme.service.ReactionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * ReactionServiceImpl - Bridge Pattern Service Implementation
 * 
 * Handles all reaction operations with database persistence.
 */
@Service
@Transactional
public class ReactionServiceImpl implements ReactionService {
    
    private final ReactionRepository reactionRepository;
    private final UserRepository userRepository;
    private final VentRepository ventRepository;
    
    public ReactionServiceImpl(ReactionRepository reactionRepository,
                              UserRepository userRepository,
                              VentRepository ventRepository) {
        this.reactionRepository = reactionRepository;
        this.userRepository = userRepository;
        this.ventRepository = ventRepository;
    }
    
    @Override
    public Reaction addReaction(Long userId, Long ventId, Reaction.ReactionType reactionType) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Vent vent = ventRepository.findById(ventId)
            .orElseThrow(() -> new RuntimeException("Vent not found"));
        
        // Check if reaction already exists
        if (reactionRepository.findByUserIdAndVentIdAndReactionType(userId, ventId, reactionType).isPresent()) {
            throw new RuntimeException("Reaction already exists");
        }
        
        Reaction reaction = Reaction.builder()
            .user(user)
            .vent(vent)
            .reactionType(reactionType)
            .build();
        
        return reactionRepository.save(reaction);
    }
    
    @Override
    public void removeReaction(Long userId, Long ventId, Reaction.ReactionType reactionType) {
        reactionRepository.deleteByUserIdAndVentIdAndReactionType(userId, ventId, reactionType);
    }
    
    @Override
    public List<Reaction> getVentReactions(Long ventId) {
        return reactionRepository.findByVentId(ventId);
    }
    
    @Override
    public boolean hasReacted(Long userId, Long ventId, Reaction.ReactionType reactionType) {
        return reactionRepository.findByUserIdAndVentIdAndReactionType(userId, ventId, reactionType).isPresent();
    }
}
