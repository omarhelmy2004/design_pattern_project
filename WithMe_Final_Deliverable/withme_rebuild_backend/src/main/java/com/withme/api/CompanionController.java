package com.withme.api;

import com.withme.model.CompanionHistory;
import com.withme.service.CompanionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * CompanionController - REST API for AI companion operations
 */
@RestController
@RequestMapping("/companion")
@CrossOrigin(origins = "*")
public class CompanionController {
    
    private final CompanionService companionService;
    
    public CompanionController(CompanionService companionService) {
        this.companionService = companionService;
    }
    
    /**
     * Send message to AI companion
     */
    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(
            @RequestParam Long userId,
            @RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        String response = companionService.chat(userId, userMessage);
        return ResponseEntity.ok(Map.of("response", response));
    }
    
    /**
     * Get conversation history
     */
    @GetMapping("/history/{userId}")
    public ResponseEntity<Page<CompanionHistory>> getHistory(
            @PathVariable Long userId,
            Pageable pageable) {
        return ResponseEntity.ok(companionService.getHistory(userId, pageable));
    }
    
    /**
     * Clear conversation history
     */
    @DeleteMapping("/history/{userId}")
    public ResponseEntity<Void> clearHistory(@PathVariable Long userId) {
        companionService.clearHistory(userId);
        return ResponseEntity.noContent().build();
    }
}
