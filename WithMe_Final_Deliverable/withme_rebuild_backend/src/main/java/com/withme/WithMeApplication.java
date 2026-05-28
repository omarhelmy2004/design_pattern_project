package com.withme;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * WithMeApplication - Main Spring Boot Application Entry Point
 * 
 * Mental Wellness Platform with Bridge Pattern Architecture
 * 
 * Features:
 * - Anonymous peer support ecosystem
 * - Support circles for shared struggles
 * - AI companion with conversation history
 * - Daily mood check-ins with streak tracking
 * - Micro-empathy reactions (I hear you, Warmth)
 * 
 * Architecture:
 * - Bridge Pattern for service abstraction
 * - Clean separation of concerns
 * - Provider-based implementation layer
 * - RESTful API design
 */
@SpringBootApplication
public class WithMeApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(WithMeApplication.class, args);
    }
    
    /**
     * Configure CORS for frontend integration
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:3001"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
