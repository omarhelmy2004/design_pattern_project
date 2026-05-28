# WithMe - Complete Deployment Guide

## Project Overview

WithMe is a mental wellness platform rebuilt with:
- **Backend**: Spring Boot 3.x with Bridge Pattern architecture
- **Frontend**: React 19 with Forest/Sage design system
- **Database**: MySQL 8.0
- **Architecture**: Microservices-ready with clean separation of concerns

## Project Structure

```
withme_rebuild_backend/     # Spring Boot backend
├── src/main/java/com/withme/
│   ├── api/                 # REST Controllers
│   ├── service/             # Service interfaces (abstraction)
│   ├── service/impl/        # Service implementations (bridge)
│   ├── provider/            # Concrete providers
│   ├── model/               # JPA entities
│   ├── repository/          # Data access layer
│   ├── util/                # Utilities
│   └── WithMeApplication.java
├── pom.xml
└── README.md

withme_rebuild_frontend/    # React frontend
├── src/
│   ├── pages/              # Page components
│   ├── components/         # Reusable components
│   ├── context/            # React context
│   ├── services/           # API services
│   ├── styles/             # CSS design system
│   ├── utils/              # Utilities
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md
```

## Database Setup

### Create Database

```sql
CREATE DATABASE withme_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE withme_db;
```

### Create Tables

```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  anonymous_id VARCHAR(64) UNIQUE NOT NULL,
  display_name VARCHAR(255),
  avatar_seed VARCHAR(255),
  theme_preference VARCHAR(50) DEFAULT 'FOREST_LIGHT',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE circles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  topic VARCHAR(100) NOT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE circle_memberships (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  circle_id BIGINT NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_membership (user_id, circle_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (circle_id) REFERENCES circles(id) ON DELETE CASCADE
);

CREATE TABLE vents (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  content TEXT NOT NULL,
  circle_id BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (circle_id) REFERENCES circles(id) ON DELETE SET NULL
);

CREATE TABLE reactions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  vent_id BIGINT NOT NULL,
  reaction_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_reaction (user_id, vent_id, reaction_type),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (vent_id) REFERENCES vents(id) ON DELETE CASCADE
);

CREATE TABLE messages (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  circle_id BIGINT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (circle_id) REFERENCES circles(id) ON DELETE CASCADE
);

CREATE TABLE check_ins (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  mood_score INT NOT NULL,
  notes TEXT,
  streak_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE companion_history (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  role VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Backend Deployment

### Local Development

1. **Configure database** in `application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/withme_db
    username: root
    password: your_password
```

2. **Build and run**:
```bash
cd withme_rebuild_backend
mvn clean install
mvn spring-boot:run
```

Server runs at `http://localhost:8080/api`

### Docker Deployment

1. **Create Dockerfile**:
```dockerfile
FROM openjdk:17-slim
WORKDIR /app
COPY target/withme-backend-1.0.0.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

2. **Build and run**:
```bash
mvn clean package
docker build -t withme-backend:1.0.0 .
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://host.docker.internal:3306/withme_db \
  -e SPRING_DATASOURCE_USERNAME=root \
  -e SPRING_DATASOURCE_PASSWORD=password \
  withme-backend:1.0.0
```

### Cloud Run Deployment

```bash
gcloud run deploy withme-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --set-env-vars SPRING_DATASOURCE_URL=jdbc:mysql://your-cloud-sql:3306/withme_db \
  --set-env-vars SPRING_DATASOURCE_USERNAME=root \
  --set-env-vars SPRING_DATASOURCE_PASSWORD=password
```

## Frontend Deployment

### Local Development

1. **Install dependencies**:
```bash
cd withme_rebuild_frontend
npm install
```

2. **Configure API URL** in `.env.local`:
```
VITE_API_URL=http://localhost:8080/api
```

3. **Run dev server**:
```bash
npm run dev
```

App runs at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Creates optimized build in `dist/` directory.

### Vercel Deployment

1. **Connect repository**:
```bash
vercel
```

2. **Configure environment**:
```
VITE_API_URL=https://your-backend-url/api
```

### Netlify Deployment

1. **Build command**: `npm run build`
2. **Publish directory**: `dist`
3. **Environment variables**:
```
VITE_API_URL=https://your-backend-url/api
```

## API Endpoints

### Authentication & Profile
- `POST /api/profile/signup` - Create new user
- `GET /api/profile/{userId}` - Get profile
- `PUT /api/profile/{userId}/displayName` - Update display name
- `PUT /api/profile/{userId}/theme` - Update theme

### Venting
- `GET /api/vents` - Get global vents
- `POST /api/vents` - Create vent
- `POST /api/vents/{id}/reactions` - Add reaction
- `DELETE /api/vents/{id}/reactions` - Remove reaction

### Circles
- `GET /api/circles` - Get public circles
- `POST /api/circles/{id}/join` - Join circle
- `GET /api/circles/{id}/messages` - Get messages
- `POST /api/circles/{id}/messages` - Post message

### Check-ins
- `POST /api/checkins` - Create check-in
- `GET /api/checkins/user/{userId}/streak` - Get streak

### Companion
- `POST /api/companion/chat` - Chat with AI
- `GET /api/companion/history/{userId}` - Get history

## Bridge Pattern Architecture

The backend implements the Bridge Pattern for clean architecture:

```
Controller (HTTP Layer)
    ↓
Service Interface (Abstraction)
    ↓
Service Implementation (Bridge)
    ↓
Provider (Concrete Implementation)
    ↓
Repository (Data Access)
```

This design allows:
- Easy provider swapping (Database ↔ Cache ↔ API)
- Clean separation of concerns
- Testability and maintainability
- Future scalability

## Forest & Sage Design System

The frontend features four elegant themes:

1. **Forest Light**: Deep green on cream
2. **Forest Dark**: Light green on deep forest
3. **Sage Light**: Soft sage on off-white
4. **Sage Dark**: Pale sage on charcoal

All colors and spacing use CSS variables for easy customization.

## Security Considerations

1. **Anonymity**: No personal data stored; users identified by UUID only
2. **CORS**: Restricted to frontend domain
3. **SQL Injection**: Prevented via parameterized queries
4. **HTTPS**: All communications encrypted in transit
5. **Rate Limiting**: Implement API throttling in production

## Monitoring & Logging

### Backend Logs
- Check `application.yml` for logging configuration
- Monitor Spring Boot metrics at `/actuator`

### Frontend Logs
- Browser console for client-side errors
- Network tab for API issues

## Performance Optimization

### Backend
- Database indexing on frequently queried columns
- Connection pooling
- Caching strategies

### Frontend
- Code splitting with React Router
- Image optimization
- Lazy loading components

## Troubleshooting

### Backend Issues
- Check database connection
- Verify CORS configuration
- Review Spring Boot logs

### Frontend Issues
- Clear browser cache
- Check API URL configuration
- Verify network requests in DevTools

## Next Steps

1. Deploy backend to production environment
2. Deploy frontend to CDN
3. Configure custom domain
4. Set up monitoring and alerts
5. Implement CI/CD pipeline
6. Add SSL certificates
7. Scale infrastructure as needed

## Support

For issues and questions, refer to the individual README files in each project directory.
