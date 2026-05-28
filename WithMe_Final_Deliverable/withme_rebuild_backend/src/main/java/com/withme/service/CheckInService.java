package com.withme.service;

import com.withme.model.CheckIn;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * CheckInService - Bridge Pattern Abstraction Layer
 * 
 * This interface defines the contract for daily check-in operations.
 */
public interface CheckInService {
    
    /**
     * Create a new check-in
     * @param userId the user checking in
     * @param moodScore the mood score (1-5)
     * @param notes optional notes
     * @return the created check-in
     */
    CheckIn createCheckIn(Long userId, Integer moodScore, String notes);
    
    /**
     * Get user's check-in history
     * @param userId the user ID
     * @param pageable pagination information
     * @return page of check-ins
     */
    Page<CheckIn> getUserCheckIns(Long userId, Pageable pageable);
    
    /**
     * Get current streak count
     * @param userId the user ID
     * @return the streak count
     */
    Integer getCurrentStreak(Long userId);
    
    /**
     * Get today's check-in if exists
     * @param userId the user ID
     * @return the check-in or null
     */
    CheckIn getTodayCheckIn(Long userId);
}
