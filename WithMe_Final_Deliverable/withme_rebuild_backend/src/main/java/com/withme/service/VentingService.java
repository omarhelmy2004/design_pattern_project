package com.withme.service;

import com.withme.model.Vent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * VentingService - Bridge Pattern Abstraction Layer
 * 
 * This interface defines the contract for venting operations.
 * The actual implementation is delegated to concrete providers,
 * allowing for flexible data source management.
 */
public interface VentingService {
    
    /**
     * Retrieve all global vents (not associated with any circle)
     * @param pageable pagination information
     * @return page of vents
     */
    Page<Vent> getGlobalVents(Pageable pageable);
    
    /**
     * Create a new vent
     * @param userId the user creating the vent
     * @param content the vent content
     * @param circleId optional circle association
     * @return the created vent
     */
    Vent createVent(Long userId, String content, Long circleId);
    
    /**
     * Get a specific vent by ID
     * @param ventId the vent ID
     * @return the vent
     */
    Vent getVentById(Long ventId);
    
    /**
     * Delete a vent
     * @param ventId the vent ID
     * @param userId the user requesting deletion (for authorization)
     */
    void deleteVent(Long ventId, Long userId);
    
    /**
     * Get vents for a specific circle
     * @param circleId the circle ID
     * @param pageable pagination information
     * @return page of vents
     */
    Page<Vent> getCircleVents(Long circleId, Pageable pageable);
}
