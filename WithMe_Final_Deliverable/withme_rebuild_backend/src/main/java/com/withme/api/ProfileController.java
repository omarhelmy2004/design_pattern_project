package com.withme.api;

import com.withme.model.User;
import com.withme.service.ProfileService;
import com.withme.util.AvatarGenerator;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * ProfileController - REST API for user profile operations
 */
@RestController
@RequestMapping("/profile")
@CrossOrigin(origins = "*")
public class ProfileController {
    
    private final ProfileService profileService;
    
    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }
    
    /**
     * Create a new user (signup)
     */
    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup() {
        String anonymousId = AvatarGenerator.generateAnonymousId();
        User user = profileService.createUser(anonymousId);
        
        String avatarSeed = AvatarGenerator.generateAvatarSeed(anonymousId);
        profileService.updateAvatarSeed(user.getId(), avatarSeed);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
            "userId", user.getId(),
            "anonymousId", anonymousId,
            "avatarSeed", avatarSeed
        ));
    }
    
    /**
     * Get user profile
     */
    @GetMapping("/{userId}")
    public ResponseEntity<User> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(profileService.getUserProfile(userId));
    }
    
    /**
     * Update display name
     */
    @PutMapping("/{userId}/displayName")
    public ResponseEntity<User> updateDisplayName(
            @PathVariable Long userId,
            @RequestBody Map<String, String> request) {
        String displayName = request.get("displayName");
        User user = profileService.updateDisplayName(userId, displayName);
        return ResponseEntity.ok(user);
    }
    
    /**
     * Update avatar seed
     */
    @PutMapping("/{userId}/avatar")
    public ResponseEntity<User> updateAvatar(
            @PathVariable Long userId,
            @RequestBody Map<String, String> request) {
        String avatarSeed = request.get("avatarSeed");
        User user = profileService.updateAvatarSeed(userId, avatarSeed);
        return ResponseEntity.ok(user);
    }
    
    /**
     * Update theme preference
     */
    @PutMapping("/{userId}/theme")
    public ResponseEntity<User> updateTheme(
            @PathVariable Long userId,
            @RequestBody Map<String, String> request) {
        String themeStr = request.get("theme");
        User.ThemePreference theme = User.ThemePreference.valueOf(themeStr);
        User user = profileService.updateThemePreference(userId, theme);
        return ResponseEntity.ok(user);
    }
}
