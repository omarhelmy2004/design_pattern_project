package com.withme.api;

import com.withme.model.Circle;
import com.withme.model.Message;
import com.withme.service.CircleService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * CircleController - REST API for support circle operations
 */
@RestController
@RequestMapping("/circles")
@CrossOrigin(origins = "*")
public class CircleController {
    
    private final CircleService circleService;
    
    public CircleController(CircleService circleService) {
        this.circleService = circleService;
    }
    
    /**
     * Get all public circles
     */
    @GetMapping
    public ResponseEntity<Page<Circle>> getPublicCircles(Pageable pageable) {
        return ResponseEntity.ok(circleService.getPublicCircles(pageable));
    }
    
    /**
     * Get circles by topic
     */
    @GetMapping("/topic/{topic}")
    public ResponseEntity<Page<Circle>> getCirclesByTopic(
            @PathVariable String topic,
            Pageable pageable) {
        return ResponseEntity.ok(circleService.getCirclesByTopic(topic, pageable));
    }
    
    /**
     * Get a specific circle
     */
    @GetMapping("/{circleId}")
    public ResponseEntity<Circle> getCircle(@PathVariable Long circleId) {
        return ResponseEntity.ok(circleService.getCircleById(circleId));
    }
    
    /**
     * Create a new circle
     */
    @PostMapping
    public ResponseEntity<Circle> createCircle(@RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        String description = (String) request.get("description");
        String topic = (String) request.get("topic");
        Boolean isPublic = (Boolean) request.get("isPublic");
        
        Circle circle = circleService.createCircle(name, description, topic, isPublic);
        return ResponseEntity.status(HttpStatus.CREATED).body(circle);
    }
    
    /**
     * Join a circle
     */
    @PostMapping("/{circleId}/join")
    public ResponseEntity<Void> joinCircle(
            @PathVariable Long circleId,
            @RequestParam Long userId) {
        circleService.joinCircle(userId, circleId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    
    /**
     * Leave a circle
     */
    @DeleteMapping("/{circleId}/leave")
    public ResponseEntity<Void> leaveCircle(
            @PathVariable Long circleId,
            @RequestParam Long userId) {
        circleService.leaveCircle(userId, circleId);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Get circle messages
     */
    @GetMapping("/{circleId}/messages")
    public ResponseEntity<Page<Message>> getCircleMessages(
            @PathVariable Long circleId,
            Pageable pageable) {
        return ResponseEntity.ok(circleService.getCircleMessages(circleId, pageable));
    }
    
    /**
     * Post message to circle
     */
    @PostMapping("/{circleId}/messages")
    public ResponseEntity<Message> postMessage(
            @PathVariable Long circleId,
            @RequestParam Long userId,
            @RequestBody Map<String, String> request) {
        String content = request.get("content");
        Message message = circleService.postMessage(userId, circleId, content);
        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }
    
    /**
     * Get user's circles
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Circle>> getUserCircles(@PathVariable Long userId) {
        return ResponseEntity.ok(circleService.getUserCircles(userId));
    }
}
