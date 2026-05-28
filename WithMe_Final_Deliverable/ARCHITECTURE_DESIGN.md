# WithMe Rebuild - Architecture Design Document

## Executive Summary

WithMe is being rebuilt as an elegant mental wellness web application with a **Spring Boot backend using the Bridge Pattern** and a **React frontend with Forest/Sage design system**. This document outlines the complete architecture, design patterns, and implementation strategy.

---

## 1. Bridge Pattern Architecture Overview

### 1.1 Pattern Definition

The **Bridge Pattern** decouples an abstraction from its implementation, allowing them to vary independently. In the context of WithMe:

- **Abstraction Layer**: Feature interfaces (e.g., `VentingService`, `CircleService`, `CompanionService`)
- **Implementation Layer**: Concrete data providers (e.g., `DatabaseVentingProvider`, `LLMCompanionProvider`)

### 1.2 Package Structure

```
com.withme
├── api                          # REST Controllers
│   ├── AuthController.java
│   ├── VentController.java
│   ├── CircleController.java
│   ├── CheckInController.java
│   ├── CompanionController.java
│   └── ProfileController.java
│
├── service                      # Abstraction Layer (Bridge Interfaces)
│   ├── VentingService.java      # Interface
│   ├── CircleService.java       # Interface
│   ├── CheckInService.java      # Interface
│   ├── CompanionService.java    # Interface
│   └── ProfileService.java      # Interface
│
├── provider                     # Implementation Layer (Concrete Implementations)
│   ├── venting
│   │   ├── DatabaseVentingProvider.java
│   │   └── VentingProviderFactory.java
│   ├── circle
│   │   ├── DatabaseCircleProvider.java
│   │   └── CircleProviderFactory.java
│   ├── checkin
│   │   ├── DatabaseCheckInProvider.java
│   │   └── CheckInProviderFactory.java
│   ├── companion
│   │   ├── LLMCompanionProvider.java
│   │   ├── HistoryStorageProvider.java
│   │   └── CompanionProviderFactory.java
│   └── profile
│       ├── DatabaseProfileProvider.java
│       └── ProfileProviderFactory.java
│
├── model                        # Data Models
│   ├── User.java
│   ├── Vent.java
│   ├── Circle.java
│   ├── CircleMembership.java
│   ├── CheckIn.java
│   ├── Reaction.java
│   ├── Message.java
│   └── CompanionHistory.java
│
├── repository                   # Data Access Layer
│   ├── UserRepository.java
│   ├── VentRepository.java
│   ├── CircleRepository.java
│   ├── CircleMembershipRepository.java
│   ├── CheckInRepository.java
│   ├── ReactionRepository.java
│   ├── MessageRepository.java
│   └── CompanionHistoryRepository.java
│
├── security                     # Authentication & Authorization
│   ├── JwtTokenProvider.java
│   ├── SecurityConfig.java
│   └── UserDetailsServiceImpl.java
│
├── util                         # Utilities
│   ├── AvatarGenerator.java     # Cryptographic shield avatars
│   ├── DateUtil.java
│   └── ValidationUtil.java
│
├── config                       # Configuration
│   ├── DatabaseConfig.java
│   ├── LLMConfig.java
│   └── CorsConfig.java
│
└── WithMeApplication.java       # Main Spring Boot Application
```

### 1.3 Bridge Pattern Flow

```
Controller (API Layer)
    ↓
Service Interface (Abstraction)
    ↓
Service Implementation (Bridge)
    ↓
Provider Interface (Implementation Abstraction)
    ↓
Concrete Provider (Database/LLM/etc.)
    ↓
Data/External Service
```

---

## 2. Database Schema

### 2.1 Core Tables

#### users
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  anonymous_id VARCHAR(64) UNIQUE NOT NULL,
  display_name VARCHAR(255),
  avatar_seed VARCHAR(255),
  theme_preference ENUM('forest_light', 'forest_dark', 'sage_light', 'sage_dark') DEFAULT 'forest_light',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### vents
```sql
CREATE TABLE vents (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  content TEXT NOT NULL,
  circle_id BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (circle_id) REFERENCES circles(id) ON DELETE SET NULL
);
```

#### circles
```sql
CREATE TABLE circles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  topic VARCHAR(100) NOT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### circle_memberships
```sql
CREATE TABLE circle_memberships (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  circle_id BIGINT NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_membership (user_id, circle_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (circle_id) REFERENCES circles(id) ON DELETE CASCADE
);
```

#### check_ins
```sql
CREATE TABLE check_ins (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  mood_score INT NOT NULL CHECK (mood_score BETWEEN 1 AND 5),
  notes TEXT,
  streak_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### reactions
```sql
CREATE TABLE reactions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  vent_id BIGINT NOT NULL,
  reaction_type ENUM('hear_you', 'warmth') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_reaction (user_id, vent_id, reaction_type),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (vent_id) REFERENCES vents(id) ON DELETE CASCADE
);
```

#### messages
```sql
CREATE TABLE messages (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  circle_id BIGINT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (circle_id) REFERENCES circles(id) ON DELETE CASCADE
);
```

#### companion_history
```sql
CREATE TABLE companion_history (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  role ENUM('user', 'assistant') NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 3. React Frontend Architecture

### 3.1 Component Structure

```
client/src
├── pages
│   ├── WelcomePage.tsx
│   ├── SignupPage.tsx
│   ├── LoginPage.tsx
│   ├── OnboardingPage.tsx
│   ├── CirclesPage.tsx
│   ├── CircleDetailPage.tsx
│   ├── CheckInPage.tsx
│   ├── VentPage.tsx
│   ├── CompanionPage.tsx
│   └── ProfilePage.tsx
│
├── components
│   ├── Layout.tsx
│   ├── Navigation.tsx
│   ├── VentCard.tsx
│   ├── CircleCard.tsx
│   ├── ReactionBar.tsx
│   ├── AvatarShield.tsx
│   ├── MoodSelector.tsx
│   ├── ChatMessage.tsx
│   └── ThemeToggle.tsx
│
├── hooks
│   ├── useAuth.ts
│   ├── useTheme.ts
│   ├── useVents.ts
│   ├── useCircles.ts
│   ├── useCheckIn.ts
│   ├── useCompanion.ts
│   └── useProfile.ts
│
├── context
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   └── NotificationContext.tsx
│
├── services
│   ├── api.ts
│   ├── auth.ts
│   ├── venting.ts
│   ├── circles.ts
│   ├── checkin.ts
│   ├── companion.ts
│   └── profile.ts
│
├── styles
│   ├── index.css
│   ├── forest-light.css
│   ├── forest-dark.css
│   ├── sage-light.css
│   └── sage-dark.css
│
└── utils
    ├── avatarGenerator.ts
    ├── dateFormatter.ts
    └── validation.ts
```

### 3.2 Forest & Sage Design System

#### Forest Light
- Primary: Deep Forest Green (#2D5016)
- Accent: Sage Green (#6B8E23)
- Background: Cream (#F5F3EE)
- Text: Dark Brown (#3E3E3E)

#### Forest Dark
- Primary: Light Forest Green (#7CB342)
- Accent: Pale Sage (#A1D82F)
- Background: Deep Forest (#1B2B1F)
- Text: Light Cream (#E8E6E1)

#### Sage Light
- Primary: Soft Sage (#8B9B7F)
- Accent: Warm Taupe (#A89968)
- Background: Off-White (#F9F7F4)
- Text: Charcoal (#4A4A4A)

#### Sage Dark
- Primary: Pale Sage (#C4D4B8)
- Accent: Golden Taupe (#D4AF9A)
- Background: Deep Charcoal (#2A2A26)
- Text: Light Sage (#E8E6E1)

---

## 4. API Endpoints

### 4.1 Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### 4.2 Venting
- `GET /api/vents` - Get all vents (paginated)
- `POST /api/vents` - Create new vent
- `GET /api/vents/:id` - Get vent details
- `DELETE /api/vents/:id` - Delete vent
- `POST /api/vents/:id/reactions` - Add reaction to vent
- `DELETE /api/vents/:id/reactions/:reactionId` - Remove reaction

### 4.3 Circles
- `GET /api/circles` - Get all circles
- `POST /api/circles` - Create new circle
- `GET /api/circles/:id` - Get circle details
- `GET /api/circles/:id/messages` - Get circle messages
- `POST /api/circles/:id/messages` - Post message to circle
- `POST /api/circles/:id/join` - Join circle
- `DELETE /api/circles/:id/leave` - Leave circle
- `POST /api/circles/:id/upload` - Upload file to circle

### 4.4 Check-ins
- `GET /api/checkins` - Get user's check-ins
- `POST /api/checkins` - Create new check-in
- `GET /api/checkins/streak` - Get current streak

### 4.5 Companion
- `GET /api/companion/history` - Get conversation history
- `POST /api/companion/chat` - Send message to AI companion
- `DELETE /api/companion/history` - Clear history

### 4.6 Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `PUT /api/profile/theme` - Update theme preference
- `GET /api/profile/circles` - Get joined circles

---

## 5. Key Features Implementation

### 5.1 Anonymous Venting
- Users post without revealing identity
- Cryptographic shield avatars generated from anonymous_id
- Reactions: "I hear you" and "Warmth" only
- Real-time feed updates

### 5.2 Support Circles
- Topic-based communities (Anxiety, Grief, Burnout, etc.)
- Public/private membership
- Real-time message feed
- Member presence indicators
- File/image sharing within circles

### 5.3 AI Companion
- 24/7 LLM-powered listener
- Persistent conversation history per user
- Empathetic responses tuned for mental wellness
- History storage in database

### 5.4 Daily Check-ins
- Mood tracking (1-5 scale)
- Optional notes
- Streak calculation
- Visual streak display

### 5.5 User Profile
- Display name management
- Avatar customization
- Theme preference (Forest/Sage, Light/Dark)
- Joined circles overview

---

## 6. Technology Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **Database**: MySQL 8.0
- **LLM Integration**: OpenAI/Groq API
- **Authentication**: JWT + Spring Security
- **Build Tool**: Maven/Gradle

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + CSS Variables
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Deployment
- **Backend**: Docker + Cloud Run
- **Frontend**: Vercel/Netlify
- **Database**: Cloud SQL (MySQL)

---

## 7. Security Considerations

1. **Anonymity**: No personal data stored; users identified by anonymous_id only
2. **JWT Authentication**: Secure token-based session management
3. **CORS**: Restricted to frontend domain
4. **SQL Injection Prevention**: Parameterized queries via JPA
5. **Rate Limiting**: API throttling to prevent abuse
6. **Data Encryption**: Sensitive data encrypted at rest
7. **HTTPS Only**: All communications encrypted in transit

---

## 8. Development Phases

### Phase 1: Backend Foundation
- Spring Boot project setup
- Database schema creation
- Bridge Pattern service layer
- Authentication implementation
- Basic CRUD operations

### Phase 2: Frontend Foundation
- React project setup
- Forest/Sage design system
- Authentication pages
- Navigation structure
- Theme switching

### Phase 3: Core Features
- Venting board
- Circles management
- Check-in tracking
- Companion chat
- Profile management

### Phase 4: Integration & Polish
- API integration
- Real-time updates
- Performance optimization
- Error handling
- User testing

### Phase 5: Deployment
- Build optimization
- Docker containerization
- CI/CD pipeline
- Production deployment

---

## 9. Deliverables

1. **Complete Source Code**: Spring Boot backend + React frontend
2. **Database Migration Scripts**: SQL files for schema creation
3. **API Documentation**: OpenAPI/Swagger specification
4. **Deployment Guide**: Docker, environment setup, deployment steps
5. **ZIP File**: Complete project package
6. **Professional PPT**: Architecture, features, and tech stack presentation

---

## 10. References

- Bridge Pattern: Gang of Four Design Patterns
- Spring Boot Best Practices: Spring.io Documentation
- React Best Practices: React.dev Official Documentation
- Forest & Sage Design: Color Psychology for Mental Wellness
