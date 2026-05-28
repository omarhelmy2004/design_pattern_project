package com.withme.provider.circle;

import com.withme.model.Circle;
import com.withme.model.CircleMembership;
import com.withme.model.Message;
import com.withme.model.User;
import com.withme.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * DatabaseCircleProvider - Bridge Pattern Implementation
 * 
 * Concrete implementation of circle operations using database persistence.
 */
@Component
public class DatabaseCircleProvider {
    
    private final CircleRepository circleRepository;
    private final CircleMembershipRepository membershipRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    
    public DatabaseCircleProvider(CircleRepository circleRepository,
                                  CircleMembershipRepository membershipRepository,
                                  MessageRepository messageRepository,
                                  UserRepository userRepository) {
        this.circleRepository = circleRepository;
        this.membershipRepository = membershipRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }
    
    public Page<Circle> getPublicCircles(Pageable pageable) {
        return circleRepository.findByIsPublicTrue(pageable);
    }
    
    public Page<Circle> getCirclesByTopic(String topic, Pageable pageable) {
        return circleRepository.findByTopicOrderByCreatedAtDesc(topic, pageable);
    }
    
    public Circle getCircleById(Long circleId) {
        return circleRepository.findById(circleId)
            .orElseThrow(() -> new RuntimeException("Circle not found"));
    }
    
    public Circle createCircle(String name, String description, String topic, Boolean isPublic) {
        Circle circle = Circle.builder()
            .name(name)
            .description(description)
            .topic(topic)
            .isPublic(isPublic)
            .build();
        
        return circleRepository.save(circle);
    }
    
    public CircleMembership joinCircle(Long userId, Long circleId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Circle circle = getCircleById(circleId);
        
        // Check if already member
        if (membershipRepository.findByUserIdAndCircleId(userId, circleId).isPresent()) {
            throw new RuntimeException("User is already a member of this circle");
        }
        
        CircleMembership membership = CircleMembership.builder()
            .user(user)
            .circle(circle)
            .build();
        
        return membershipRepository.save(membership);
    }
    
    public void leaveCircle(Long userId, Long circleId) {
        membershipRepository.deleteByUserIdAndCircleId(userId, circleId);
    }
    
    public Page<Message> getCircleMessages(Long circleId, Pageable pageable) {
        return messageRepository.findByCircleIdOrderByCreatedAtDesc(circleId, pageable);
    }
    
    public Message postMessage(Long userId, Long circleId, String content) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Circle circle = getCircleById(circleId);
        
        Message message = Message.builder()
            .user(user)
            .circle(circle)
            .content(content)
            .build();
        
        return messageRepository.save(message);
    }
    
    public List<Circle> getUserCircles(Long userId) {
        List<CircleMembership> memberships = membershipRepository.findByUserId(userId);
        return memberships.stream()
            .map(CircleMembership::getCircle)
            .collect(Collectors.toList());
    }
}
