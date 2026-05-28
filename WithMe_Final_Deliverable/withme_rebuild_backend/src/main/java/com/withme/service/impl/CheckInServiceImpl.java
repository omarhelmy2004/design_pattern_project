package com.withme.service.impl;

import com.withme.model.CheckIn;
import com.withme.model.User;
import com.withme.repository.CheckInRepository;
import com.withme.repository.UserRepository;
import com.withme.service.CheckInService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;

/**
 * CheckInServiceImpl - Bridge Pattern Service Implementation
 * 
 * Handles daily check-in operations with streak tracking.
 */
@Service
@Transactional
public class CheckInServiceImpl implements CheckInService {
    
    private final CheckInRepository checkInRepository;
    private final UserRepository userRepository;
    
    public CheckInServiceImpl(CheckInRepository checkInRepository, UserRepository userRepository) {
        this.checkInRepository = checkInRepository;
        this.userRepository = userRepository;
    }
    
    @Override
    public CheckIn createCheckIn(Long userId, Integer moodScore, String notes) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (moodScore < 1 || moodScore > 5) {
            throw new RuntimeException("Mood score must be between 1 and 5");
        }
        
        // Calculate streak
        Integer streak = calculateStreak(userId);
        
        CheckIn checkIn = CheckIn.builder()
            .user(user)
            .moodScore(moodScore)
            .notes(notes)
            .streakCount(streak)
            .build();
        
        return checkInRepository.save(checkIn);
    }
    
    @Override
    public Page<CheckIn> getUserCheckIns(Long userId, Pageable pageable) {
        return checkInRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }
    
    @Override
    public Integer getCurrentStreak(Long userId) {
        return calculateStreak(userId);
    }
    
    @Override
    public CheckIn getTodayCheckIn(Long userId) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        
        long count = checkInRepository.countByUserIdAndCreatedAtAfter(userId, startOfDay);
        
        if (count > 0) {
            return checkInRepository.findTopByUserIdOrderByCreatedAtDesc(userId).orElse(null);
        }
        return null;
    }
    
    private Integer calculateStreak(Long userId) {
        CheckIn lastCheckIn = checkInRepository.findTopByUserIdOrderByCreatedAtDesc(userId).orElse(null);
        
        if (lastCheckIn == null) {
            return 1;
        }
        
        LocalDate lastCheckInDate = lastCheckIn.getCreatedAt().toLocalDate();
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);
        
        if (lastCheckInDate.equals(today)) {
            return lastCheckIn.getStreakCount(); // Already checked in today
        } else if (lastCheckInDate.equals(yesterday)) {
            return lastCheckIn.getStreakCount() + 1; // Extend streak
        } else {
            return 1; // Streak broken, restart
        }
    }
}
