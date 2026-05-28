package com.withme.service.impl;

import com.withme.model.CompanionHistory;
import com.withme.model.User;
import com.withme.repository.CompanionHistoryRepository;
import com.withme.repository.UserRepository;
import com.withme.service.CompanionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * CompanionServiceImpl - Bridge Pattern Service Implementation
 * 
 * Handles AI companion operations with conversation history persistence.
 * The actual LLM integration would be injected as a dependency.
 */
@Service
@Transactional
public class CompanionServiceImpl implements CompanionService {
    
    private final CompanionHistoryRepository historyRepository;
    private final UserRepository userRepository;
    // LLM provider would be injected here
    // private final LLMProvider llmProvider;
    
    public CompanionServiceImpl(CompanionHistoryRepository historyRepository,
                               UserRepository userRepository) {
        this.historyRepository = historyRepository;
        this.userRepository = userRepository;
    }
    
    @Override
    public String chat(Long userId, String userMessage) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Save user message
        saveMessage(userId, CompanionHistory.Role.USER, userMessage);
        
        // Get conversation history for context
        Page<CompanionHistory> history = historyRepository.findByUserIdOrderByCreatedAtDesc(
            userId, org.springframework.data.domain.PageRequest.of(0, 10));
        
        // TODO: Call LLM provider with history context
        // String assistantResponse = llmProvider.generateResponse(userMessage, history);
        
        // For now, return a placeholder response
        String assistantResponse = "I hear you. Thank you for sharing. How can I support you further?";
        
        // Save assistant response
        saveMessage(userId, CompanionHistory.Role.ASSISTANT, assistantResponse);
        
        return assistantResponse;
    }
    
    @Override
    public Page<CompanionHistory> getHistory(Long userId, Pageable pageable) {
        return historyRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }
    
    @Override
    public void clearHistory(Long userId) {
        historyRepository.deleteByUserId(userId);
    }
    
    @Override
    public void saveMessage(Long userId, CompanionHistory.Role role, String content) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        CompanionHistory history = CompanionHistory.builder()
            .user(user)
            .role(role)
            .content(content)
            .build();
        
        historyRepository.save(history);
    }
}
