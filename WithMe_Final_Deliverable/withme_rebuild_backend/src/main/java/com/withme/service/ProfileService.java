package com.withme.service;

import com.withme.model.User;

/**
 * ProfileService - Bridge Pattern Abstraction Layer
 * 
 * This interface defines the contract for user profile operations.
 */
public interface ProfileService {
    
    /**
     * Get user profile by ID
     * @param userId the user ID
     * @return the user profile
     */
    User getUserProfile(Long userId);
    
    /**
     * Update user display name
     * @param userId the user ID
     * @param displayName the new display name
     * @return the updated user
     */
    User updateDisplayName(Long userId, String displayName);
    
    /**
     * Update user avatar seed
     * @param userId the user ID
     * @param avatarSeed the new avatar seed
     * @return the updated user
     */
    User updateAvatarSeed(Long userId, String avatarSeed);
    
    /**
     * Update user theme preference
     * @param userId the user ID
     * @param theme the new theme preference
     * @return the updated user
     */
    User updateThemePreference(Long userId, User.ThemePreference theme);
    
    /**
     * Create a new user with anonymous ID
     * @param anonymousId the anonymous ID
     * @return the created user
     */
    User createUser(String anonymousId);
}
