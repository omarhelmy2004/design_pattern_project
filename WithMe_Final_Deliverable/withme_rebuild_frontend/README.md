# WithMe Frontend - React with Forest/Sage Design System

A modern, elegant mental wellness web application built with React 19 and Vite, featuring a beautiful Forest & Sage design system.

## Features

- **Anonymous Venting**: Share emotions without revealing identity
- **Support Circles**: Join communities around shared struggles
- **AI Companion**: 24/7 empathetic listener with conversation history
- **Daily Check-ins**: Track mood and build streaks
- **User Profile**: Customize display name, avatar, and theme
- **Forest & Sage Design**: Four elegant theme variants (Forest Light/Dark, Sage Light/Dark)

## Technology Stack

- **React 19**: Modern UI library
- **Vite**: Lightning-fast build tool
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication
- **Lucide React**: Beautiful SVG icons
- **CSS Variables**: Dynamic theming system

## Project Structure

```
src/
├── pages/              # Page components
├── components/         # Reusable components
├── context/           # React context (Auth, Theme)
├── services/          # API service layer
├── hooks/             # Custom React hooks
├── styles/            # CSS with design system
├── utils/             # Utility functions
├── App.jsx            # Main app component
└── main.jsx           # Entry point
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will start at `http://localhost:5173`

### Build

```bash
npm run build
```

## Design System

### Forest & Sage Themes

The application supports four elegant theme variants:

1. **Forest Light**: Deep forest green on cream background
2. **Forest Dark**: Light forest green on deep forest background
3. **Sage Light**: Soft sage on off-white background
4. **Sage Dark**: Pale sage on deep charcoal background

### CSS Variables

All colors, spacing, typography, and shadows are defined as CSS variables in `src/styles/index.css`, making it easy to customize the entire design system.

## API Integration

The frontend communicates with the Spring Boot backend via REST APIs. The API base URL can be configured via the `VITE_API_URL` environment variable.

### Services

- `services/auth.js` - Authentication
- `services/venting.js` - Venting operations
- `services/circles.js` - Circle management
- `services/checkin.js` - Check-in tracking
- `services/companion.js` - AI companion chat

## Context Providers

### AuthContext
Manages user authentication state and provides login/signup/logout functions.

### ThemeContext
Manages theme selection and provides theme switching functionality.

## Avatar System

The avatar system generates deterministic, anonymous avatars based on the user's anonymous ID. The same ID always generates the same avatar, ensuring consistency across sessions.

## Responsive Design

The application is fully responsive and works on desktop, tablet, and mobile devices.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Development Guidelines

### Adding a New Page

1. Create a new component in `src/pages/`
2. Add the route in `src/App.jsx`
3. Add navigation link in `src/components/Layout.jsx`

### Adding a New Service

1. Create a new file in `src/services/`
2. Export functions that call the API
3. Use in components via hooks or direct imports

### Styling

- Use CSS variables for colors and spacing
- Follow the existing naming conventions
- Keep responsive design in mind

## Environment Variables

Create a `.env.local` file in the root directory:

```
VITE_API_URL=http://localhost:8080/api
```

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Deploy to Vercel

```bash
vercel
```

### Deploy to Netlify

```bash
netlify deploy --prod --dir=dist
```

## License

MIT License

## Support

For issues and questions, please open an issue on the repository.
