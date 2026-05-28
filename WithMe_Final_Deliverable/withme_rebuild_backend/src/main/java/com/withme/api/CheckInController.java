package com.withme.api;

import com.withme.model.CheckIn;
import com.withme.service.CheckInService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * CheckInController - REST API for daily check-in operations
 */
@RestController
@RequestMapping("/checkins")
@CrossOrigin(origins = "*")
public class CheckInController {
    
    private final CheckInService checkInService;
    
    public CheckInController(CheckInService checkInService) {
        this.checkInService = checkInService;
    }
    
    /**
     * Create a new check-in
     */
    @PostMapping
    public ResponseEntity<CheckIn> createCheckIn(
            @RequestParam Long userId,
            @RequestBody Map<String, Object> request) {
        Integer moodScore = (Integer) request.get("moodScore");
        String notes = (String) request.get("notes");
        
        CheckIn checkIn = checkInService.createCheckIn(userId, moodScore, notes);
        return ResponseEntity.status(HttpStatus.CREATED).body(checkIn);
    }
    
    /**
     * Get user's check-in history
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<CheckIn>> getUserCheckIns(
            @PathVariable Long userId,
            Pageable pageable) {
        return ResponseEntity.ok(checkInService.getUserCheckIns(userId, pageable));
    }
    
    /**
     * Get current streak
     */
    @GetMapping("/user/{userId}/streak")
    public ResponseEntity<Map<String, Integer>> getCurrentStreak(@PathVariable Long userId) {
        Integer streak = checkInService.getCurrentStreak(userId);
        return ResponseEntity.ok(Map.of("streak", streak));
    }
    
    /**
     * Get today's check-in
     */
    @GetMapping("/user/{userId}/today")
    public ResponseEntity<CheckIn> getTodayCheckIn(@PathVariable Long userId) {
        CheckIn checkIn = checkInService.getTodayCheckIn(userId);
        if (checkIn == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(checkIn);
    }
}
