package com.withme.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "reactions", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "vent_id", "reaction_type"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vent_id", nullable = false)
    private Vent vent;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ReactionType reactionType;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public enum ReactionType {
        HEAR_YOU("I hear you"),
        WARMTH("Warmth");
        
        private final String label;
        
        ReactionType(String label) {
            this.label = label;
        }
        
        public String getLabel() {
            return label;
        }
    }
}
