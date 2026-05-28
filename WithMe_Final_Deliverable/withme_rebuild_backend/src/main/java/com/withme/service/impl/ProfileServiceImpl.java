package com.withme.service.impl;

import com.withme.model.User;
import com.withme.repository.UserRepository;
import com.withme.service.ProfileService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * ProfileServiceImpl - Bridge Pattern Service Implementation
 * 
 * Handles user profile operations with database persistence.
 */
@Service
@Transactional
public class ProfileServiceImpl implements ProfileService {
    
    private final UserRepository userRepository;
    
    public ProfileServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @Override
    public User getUserProfile(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    @Override
    public User updateDisplayName(Long userId, String displayName) {
        User user = getUserProfile(userId);
        user.setDisplayName(displayName);
        return userRepository.save(user);
    }
    
    @Override
    public User updateAvatarSeed(Long userId, String avatarSeed) {
        User user = getUserProfile(userId);
        user.setAvatarSeed(avatarSeed);
        return userRepository.save(user);
    }
    
    @Override
    public User updateThemePreference(Long userId, User.ThemePreference theme) {
        User user = getUserProfile(userId);
        user.setThemePreference(theme);
        return userRepository.save(user);
    }
    
    @Override
    public User createUser(String anonymousId) {
        User user = User.builder()
            .anonymousId(anonymousId)
            .themePreference(User.ThemePreference.FOREST_LIGHT)
            .build();
        
        return userRepository.save(user);
    }
}
