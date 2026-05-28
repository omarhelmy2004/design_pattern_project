package com.withme.api;

import com.withme.model.Vent;
import com.withme.model.Reaction;
import com.withme.service.VentingService;
import com.withme.service.ReactionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * VentController - REST API for venting operations
 * 
 * Exposes endpoints for creating, retrieving, and managing vents.
 */
@RestController
@RequestMapping("/vents")
@CrossOrigin(origins = "*")
public class VentController {
    
    private final VentingService ventingService;
    private final ReactionService reactionService;
    
    public VentController(VentingService ventingService, ReactionService reactionService) {
        this.ventingService = ventingService;
        this.reactionService = reactionService;
    }
    
    /**
     * Get all global vents
     */
    @GetMapping
    public ResponseEntity<Page<Vent>> getGlobalVents(Pageable pageable) {
        return ResponseEntity.ok(ventingService.getGlobalVents(pageable));
    }
    
    /**
     * Create a new vent
     */
    @PostMapping
    public ResponseEntity<Vent> createVent(
            @RequestParam Long userId,
            @RequestBody Map<String, Object> request) {
        String content = (String) request.get("content");
        Long circleId = (Long) request.get("circleId");
        
        Vent vent = ventingService.createVent(userId, content, circleId);
        return ResponseEntity.status(HttpStatus.CREATED).body(vent);
    }
    
    /**
     * Get a specific vent
     */
    @GetMapping("/{ventId}")
    public ResponseEntity<Vent> getVent(@PathVariable Long ventId) {
        return ResponseEntity.ok(ventingService.getVentById(ventId));
    }
    
    /**
     * Delete a vent
     */
    @DeleteMapping("/{ventId}")
    public ResponseEntity<Void> deleteVent(
            @PathVariable Long ventId,
            @RequestParam Long userId) {
        ventingService.deleteVent(ventId, userId);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Get vents for a circle
     */
    @GetMapping("/circle/{circleId}")
    public ResponseEntity<Page<Vent>> getCircleVents(
            @PathVariable Long circleId,
            Pageable pageable) {
        return ResponseEntity.ok(ventingService.getCircleVents(circleId, pageable));
    }
    
    /**
     * Add reaction to a vent
     */
    @PostMapping("/{ventId}/reactions")
    public ResponseEntity<Reaction> addReaction(
            @PathVariable Long ventId,
            @RequestParam Long userId,
            @RequestBody Map<String, String> request) {
        String reactionTypeStr = request.get("reactionType");
        Reaction.ReactionType reactionType = Reaction.ReactionType.valueOf(reactionTypeStr);
        
        Reaction reaction = reactionService.addReaction(userId, ventId, reactionType);
        return ResponseEntity.status(HttpStatus.CREATED).body(reaction);
    }
    
    /**
     * Remove reaction from a vent
     */
    @DeleteMapping("/{ventId}/reactions")
    public ResponseEntity<Void> removeReaction(
            @PathVariable Long ventId,
            @RequestParam Long userId,
            @RequestParam String reactionType) {
        Reaction.ReactionType type = Reaction.ReactionType.valueOf(reactionType);
        reactionService.removeReaction(userId, ventId, type);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Get reactions for a vent
     */
    @GetMapping("/{ventId}/reactions")
    public ResponseEntity<List<Reaction>> getReactions(@PathVariable Long ventId) {
        return ResponseEntity.ok(reactionService.getVentReactions(ventId));
    }
}
