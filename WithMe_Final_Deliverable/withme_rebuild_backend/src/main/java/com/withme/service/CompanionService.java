package com.withme.service;

import com.withme.model.CompanionHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * CompanionService - Bridge Pattern Abstraction Layer
 * 
 * This interface defines the contract for AI companion operations.
 */
public interface CompanionService {
    
    /**
     * Send a message to the AI companion and get a response
     * @param userId the user ID
     * @param userMessage the user's message
     * @return the assistant's response
     */
    String chat(Long userId, String userMessage);
    
    /**
     * Get conversation history
     * @param userId the user ID
     * @param pageable pagination information
     * @return page of conversation history
     */
    Page<CompanionHistory> getHistory(Long userId, Pageable pageable);
    
    /**
     * Clear conversation history
     * @param userId the user ID
     */
    void clearHistory(Long userId);
    
    /**
     * Save a message to history
     * @param userId the user ID
     * @param role the role (USER or ASSISTANT)
     * @param content the message content
     */
    void saveMessage(Long userId, CompanionHistory.Role role, String content);
}
