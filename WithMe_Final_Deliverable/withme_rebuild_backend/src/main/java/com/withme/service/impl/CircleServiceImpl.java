package com.withme.service.impl;

import com.withme.model.Circle;
import com.withme.model.CircleMembership;
import com.withme.model.Message;
import com.withme.provider.circle.DatabaseCircleProvider;
import com.withme.service.CircleService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * CircleServiceImpl - Bridge Pattern Service Implementation
 * 
 * This service bridges the abstraction (CircleService interface) 
 * with the concrete implementation (DatabaseCircleProvider).
 */
@Service
@Transactional
public class CircleServiceImpl implements CircleService {
    
    private final DatabaseCircleProvider circleProvider;
    
    public CircleServiceImpl(DatabaseCircleProvider circleProvider) {
        this.circleProvider = circleProvider;
    }
    
    @Override
    public Page<Circle> getPublicCircles(Pageable pageable) {
        return circleProvider.getPublicCircles(pageable);
    }
    
    @Override
    public Page<Circle> getCirclesByTopic(String topic, Pageable pageable) {
        return circleProvider.getCirclesByTopic(topic, pageable);
    }
    
    @Override
    public Circle getCircleById(Long circleId) {
        return circleProvider.getCircleById(circleId);
    }
    
    @Override
    public Circle createCircle(String name, String description, String topic, Boolean isPublic) {
        return circleProvider.createCircle(name, description, topic, isPublic);
    }
    
    @Override
    public CircleMembership joinCircle(Long userId, Long circleId) {
        return circleProvider.joinCircle(userId, circleId);
    }
    
    @Override
    public void leaveCircle(Long userId, Long circleId) {
        circleProvider.leaveCircle(userId, circleId);
    }
    
    @Override
    public Page<Message> getCircleMessages(Long circleId, Pageable pageable) {
        return circleProvider.getCircleMessages(circleId, pageable);
    }
    
    @Override
    public Message postMessage(Long userId, Long circleId, String content) {
        return circleProvider.postMessage(userId, circleId, content);
    }
    
    @Override
    public List<Circle> getUserCircles(Long userId) {
        return circleProvider.getUserCircles(userId);
    }
}
