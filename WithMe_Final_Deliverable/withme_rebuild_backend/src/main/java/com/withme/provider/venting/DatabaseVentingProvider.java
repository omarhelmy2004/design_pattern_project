package com.withme.provider.venting;

import com.withme.model.User;
import com.withme.model.Vent;
import com.withme.model.Circle;
import com.withme.repository.VentRepository;
import com.withme.repository.UserRepository;
import com.withme.repository.CircleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

/**
 * DatabaseVentingProvider - Bridge Pattern Implementation
 * 
 * Concrete implementation of venting operations using database persistence.
 * This provider handles all database interactions for venting features.
 */
@Component
public class DatabaseVentingProvider {
    
    private final VentRepository ventRepository;
    private final UserRepository userRepository;
    private final CircleRepository circleRepository;
    
    public DatabaseVentingProvider(VentRepository ventRepository, 
                                   UserRepository userRepository,
                                   CircleRepository circleRepository) {
        this.ventRepository = ventRepository;
        this.userRepository = userRepository;
        this.circleRepository = circleRepository;
    }
    
    public Page<Vent> getGlobalVents(Pageable pageable) {
        return ventRepository.findByCircleIsNullOrderByCreatedAtDesc(pageable);
    }
    
    public Vent createVent(Long userId, String content, Long circleId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Vent vent = Vent.builder()
            .user(user)
            .content(content)
            .circle(circleId != null ? circleRepository.findById(circleId).orElse(null) : null)
            .build();
        
        return ventRepository.save(vent);
    }
    
    public Vent getVentById(Long ventId) {
        return ventRepository.findById(ventId)
            .orElseThrow(() -> new RuntimeException("Vent not found"));
    }
    
    public void deleteVent(Long ventId, Long userId) {
        Vent vent = getVentById(ventId);
        if (!vent.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: user cannot delete this vent");
        }
        ventRepository.delete(vent);
    }
    
    public Page<Vent> getCircleVents(Long circleId, Pageable pageable) {
        return ventRepository.findByCircleIdOrderByCreatedAtDesc(circleId, pageable);
    }
}
