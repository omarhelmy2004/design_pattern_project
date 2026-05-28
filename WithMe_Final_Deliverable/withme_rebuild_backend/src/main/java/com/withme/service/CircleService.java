package com.withme.service;

import com.withme.model.Circle;
import com.withme.model.CircleMembership;
import com.withme.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * CircleService - Bridge Pattern Abstraction Layer
 * 
 * This interface defines the contract for support circle operations.
 * The actual implementation is delegated to concrete providers.
 */
public interface CircleService {
    
    /**
     * Get all public circles
     * @param pageable pagination information
     * @return page of circles
     */
    Page<Circle> getPublicCircles(Pageable pageable);
    
    /**
     * Get circles by topic
     * @param topic the topic name
     * @param pageable pagination information
     * @return page of circles
     */
    Page<Circle> getCirclesByTopic(String topic, Pageable pageable);
    
    /**
     * Get a specific circle by ID
     * @param circleId the circle ID
     * @return the circle
     */
    Circle getCircleById(Long circleId);
    
    /**
     * Create a new circle
     * @param name circle name
     * @param description circle description
     * @param topic circle topic
     * @param isPublic whether the circle is public
     * @return the created circle
     */
    Circle createCircle(String name, String description, String topic, Boolean isPublic);
    
    /**
     * Join a circle
     * @param userId the user joining
     * @param circleId the circle to join
     * @return the membership
     */
    CircleMembership joinCircle(Long userId, Long circleId);
    
    /**
     * Leave a circle
     * @param userId the user leaving
     * @param circleId the circle to leave
     */
    void leaveCircle(Long userId, Long circleId);
    
    /**
     * Get messages in a circle
     * @param circleId the circle ID
     * @param pageable pagination information
     * @return page of messages
     */
    Page<Message> getCircleMessages(Long circleId, Pageable pageable);
    
    /**
     * Post a message to a circle
     * @param userId the user posting
     * @param circleId the circle
     * @param content the message content
     * @return the created message
     */
    Message postMessage(Long userId, Long circleId, String content);
    
    /**
     * Get user's joined circles
     * @param userId the user ID
     * @return list of circles
     */
    java.util.List<Circle> getUserCircles(Long userId);
}
