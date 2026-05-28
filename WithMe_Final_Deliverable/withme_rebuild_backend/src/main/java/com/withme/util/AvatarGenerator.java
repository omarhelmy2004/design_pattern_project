package com.withme.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

/**
 * AvatarGenerator - Utility for generating cryptographic shield avatars
 * 
 * Creates deterministic, anonymous avatars based on user's anonymous ID.
 * The same anonymous ID will always generate the same avatar.
 */
public class AvatarGenerator {
    
    private static final String[] COLORS = {
        "#2D5016", "#6B8E23", "#7CB342", "#A1D82F",
        "#8B9B7F", "#A89968", "#C4D4B8", "#D4AF9A"
    };
    
    private static final String[] SHAPES = {
        "circle", "square", "triangle", "diamond", "hexagon", "star"
    };
    
    /**
     * Generate a unique anonymous ID
     * @return a UUID-based anonymous ID
     */
    public static String generateAnonymousId() {
        return UUID.randomUUID().toString().substring(0, 16);
    }
    
    /**
     * Generate avatar seed from anonymous ID
     * @param anonymousId the user's anonymous ID
     * @return a seed string for avatar generation
     */
    public static String generateAvatarSeed(String anonymousId) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(anonymousId.getBytes());
            
            // Convert hash to hex string
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
    
    /**
     * Get color from seed
     * @param seed the avatar seed
     * @return a color hex code
     */
    public static String getColorFromSeed(String seed) {
        int hash = seed.hashCode();
        int index = Math.abs(hash) % COLORS.length;
        return COLORS[index];
    }
    
    /**
     * Get shape from seed
     * @param seed the avatar seed
     * @return a shape name
     */
    public static String getShapeFromSeed(String seed) {
        int hash = seed.hashCode();
        int index = Math.abs(hash / 31) % SHAPES.length;
        return SHAPES[index];
    }
    
    /**
     * Generate complete avatar configuration
     * @param anonymousId the user's anonymous ID
     * @return a JSON-like avatar configuration
     */
    public static String generateAvatarConfig(String anonymousId) {
        String seed = generateAvatarSeed(anonymousId);
        String color = getColorFromSeed(seed);
        String shape = getShapeFromSeed(seed);
        
        return String.format(
            "{\"seed\":\"%s\",\"color\":\"%s\",\"shape\":\"%s\"}",
            seed, color, shape
        );
    }
}
