package com.withme.service.impl;

import com.withme.model.Vent;
import com.withme.provider.venting.DatabaseVentingProvider;
import com.withme.service.VentingService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * VentingServiceImpl - Bridge Pattern Service Implementation
 * 
 * This service bridges the abstraction (VentingService interface) 
 * with the concrete implementation (DatabaseVentingProvider).
 * 
 * The Bridge Pattern allows us to:
 * - Decouple the service interface from implementation details
 * - Easily swap providers (e.g., from Database to Cache)
 * - Maintain clean separation of concerns
 */
@Service
@Transactional
public class VentingServiceImpl implements VentingService {
    
    private final DatabaseVentingProvider ventingProvider;
    
    public VentingServiceImpl(DatabaseVentingProvider ventingProvider) {
        this.ventingProvider = ventingProvider;
    }
    
    @Override
    public Page<Vent> getGlobalVents(Pageable pageable) {
        return ventingProvider.getGlobalVents(pageable);
    }
    
    @Override
    public Vent createVent(Long userId, String content, Long circleId) {
        return ventingProvider.createVent(userId, content, circleId);
    }
    
    @Override
    public Vent getVentById(Long ventId) {
        return ventingProvider.getVentById(ventId);
    }
    
    @Override
    public void deleteVent(Long ventId, Long userId) {
        ventingProvider.deleteVent(ventId, userId);
    }
    
    @Override
    public Page<Vent> getCircleVents(Long circleId, Pageable pageable) {
        return ventingProvider.getCircleVents(circleId, pageable);
    }
}
