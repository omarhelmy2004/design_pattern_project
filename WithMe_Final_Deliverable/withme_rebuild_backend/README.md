# WithMe Backend - Spring Boot with Bridge Pattern

A mental wellness platform backend built with Spring Boot 3.x using the **Bridge Design Pattern** for clean architecture and separation of concerns.

## Architecture Overview

### Bridge Pattern Implementation

The WithMe backend implements the Bridge Pattern to decouple abstraction from implementation:

```
Controller Layer (REST API)
    ↓
Service Layer (Abstraction - Interfaces)
    ↓
Service Implementation (Bridge)
    ↓
Provider Layer (Concrete Implementation)
    ↓
Repository Layer (Data Access)
```

### Package Structure

- **api/**: REST Controllers for HTTP endpoints
- **service/**: Service interfaces (abstraction layer)
- **service/impl/**: Service implementations (bridge layer)
- **provider/**: Concrete data providers (implementation layer)
- **model/**: JPA entities
- **repository/**: Spring Data JPA repositories
- **security/**: Authentication and authorization
- **util/**: Utility classes (avatar generation, etc.)
- **config/**: Spring configuration classes

## Core Features

### 1. Anonymous Venting
- Users post anonymously without revealing identity
- Cryptographic shield avatars generated from anonymous ID
- Micro-empathy reactions: "I hear you" and "Warmth"
- Global venting feed with pagination

### 2. Support Circles
- Topic-based communities (Anxiety, Grief, Burnout, etc.)
- Public/private membership
- Real-time message feed
- Member presence tracking

### 3. AI Companion
- 24/7 LLM-powered listener
- Persistent conversation history per user
- Empathetic responses tuned for mental wellness
- History management and clearing

### 4. Daily Check-ins
- Mood tracking (1-5 scale)
- Optional notes
- Streak calculation and tracking
- Historical data retrieval

### 5. User Profile
- Display name management
- Avatar customization
- Theme preference (Forest/Sage, Light/Dark)
- Joined circles overview

## API Endpoints

### Venting
- `GET /api/vents` - Get all global vents
- `POST /api/vents` - Create new vent
- `GET /api/vents/{id}` - Get vent details
- `DELETE /api/vents/{id}` - Delete vent
- `GET /api/vents/{id}/reactions` - Get reactions
- `POST /api/vents/{id}/reactions` - Add reaction
- `DELETE /api/vents/{id}/reactions` - Remove reaction

### Circles
- `GET /api/circles` - Get public circles
- `GET /api/circles/topic/{topic}` - Get circles by topic
- `POST /api/circles` - Create circle
- `GET /api/circles/{id}` - Get circle details
- `POST /api/circles/{id}/join` - Join circle
- `DELETE /api/circles/{id}/leave` - Leave circle
- `GET /api/circles/{id}/messages` - Get messages
- `POST /api/circles/{id}/messages` - Post message

### Check-ins
- `POST /api/checkins` - Create check-in
- `GET /api/checkins/user/{userId}` - Get history
- `GET /api/checkins/user/{userId}/streak` - Get streak
- `GET /api/checkins/user/{userId}/today` - Get today's check-in

### Companion
- `POST /api/companion/chat` - Chat with AI
- `GET /api/companion/history/{userId}` - Get history
- `DELETE /api/companion/history/{userId}` - Clear history

### Profile
- `POST /api/profile/signup` - Create new user
- `GET /api/profile/{userId}` - Get profile
- `PUT /api/profile/{userId}/displayName` - Update name
- `PUT /api/profile/{userId}/avatar` - Update avatar
- `PUT /api/profile/{userId}/theme` - Update theme

## Database Schema

### Core Tables

**users**
- id (PK)
- anonymousId (UNIQUE)
- displayName
- avatarSeed
- themePreference
- createdAt, updatedAt

**vents**
- id (PK)
- userId (FK)
- content
- circleId (FK, nullable)
- createdAt, updatedAt

**circles**
- id (PK)
- name
- description
- topic
- isPublic
- createdAt, updatedAt

**circle_memberships**
- id (PK)
- userId (FK)
- circleId (FK)
- joinedAt

**reactions**
- id (PK)
- userId (FK)
- ventId (FK)
- reactionType (HEAR_YOU, WARMTH)
- createdAt

**messages**
- id (PK)
- userId (FK)
- circleId (FK)
- content
- createdAt

**check_ins**
- id (PK)
- userId (FK)
- moodScore (1-5)
- notes
- streakCount
- createdAt

**companion_history**
- id (PK)
- userId (FK)
- role (USER, ASSISTANT)
- content
- createdAt

## Setup & Installation

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8.0+

### Configuration

1. **Clone the repository**
```bash
git clone <repository-url>
cd withme_rebuild_backend
```

2. **Configure database**
Edit `src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/withme_db
    username: your_username
    password: your_password
```

3. **Build the project**
```bash
mvn clean install
```

4. **Run the application**
```bash
mvn spring-boot:run
```

The server will start at `http://localhost:8080/api`

## Development

### Adding a New Feature

1. **Create Model** in `model/`
2. **Create Repository** in `repository/`
3. **Create Service Interface** in `service/`
4. **Create Service Implementation** in `service/impl/`
5. **Create Provider** in `provider/`
6. **Create Controller** in `api/`
7. **Write Tests** in `src/test/`

### Bridge Pattern Example

```java
// 1. Define abstraction (interface)
public interface VentingService {
    Vent createVent(Long userId, String content, Long circleId);
}

// 2. Create provider (implementation)
@Component
public class DatabaseVentingProvider {
    public Vent createVent(Long userId, String content, Long circleId) {
        // Database logic
    }
}

// 3. Implement service (bridge)
@Service
public class VentingServiceImpl implements VentingService {
    private final DatabaseVentingProvider provider;
    
    public Vent createVent(Long userId, String content, Long circleId) {
        return provider.createVent(userId, content, circleId);
    }
}

// 4. Use in controller
@RestController
public class VentController {
    private final VentingService service;
    
    @PostMapping("/vents")
    public Vent createVent(...) {
        return service.createVent(...);
    }
}
```

## Security

- Anonymous user identification via UUID-based anonymous IDs
- No personal data storage
- JWT-based authentication (when extended)
- CORS configuration for frontend integration
- SQL injection prevention via parameterized queries
- Row-level security through service layer authorization

## Testing

Run tests with:
```bash
mvn test
```

## Deployment

### Docker

```bash
mvn clean package
docker build -t withme-backend .
docker run -p 8080:8080 withme-backend
```

### Cloud Run

```bash
gcloud run deploy withme-backend \
  --source . \
  --platform managed \
  --region us-central1
```

## Technology Stack

- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: MySQL 8.0
- **ORM**: Hibernate/JPA
- **Build**: Maven
- **Authentication**: JWT (extensible)
- **API**: RESTful with CORS

## License

MIT License

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## Support

For issues and questions, please open an issue on the repository.
