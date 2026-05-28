<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/handshake.svg" width="80" alt="WithMe Logo" />
  <h1>WithMe</h1>
  <p><strong>A secure, anonymous peer-support ecosystem for navigated shared life struggles.</strong></p>
  
  <p>
    <a href="https://with-me-alpha.vercel.app/"><strong>Live Demo</strong></a> •
    <a href="#core-philosophy">Philosophy</a> •
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#setup">Setup</a>
  </p>
</div>

---

## About The Project

WithMe is a premium, high-fidelity web application designed to help people connect over shared life experiences. It is architected on the principle that true healing begins when we realize we are not alone. 

By stripping away the performance-based nature of traditional social media, WithMe provides a sanctuary for pure empathy. Featuring a sophisticated forest glassmorphism design, real-time presence tracking, and uncompromising anonymity, it sets a new standard for safe human connection.

**Live Deployment:** [with-me-app.vercel.app](https://with-me-alpha.vercel.app/)

---

## Core Features

- **Anonymous Venting** — A judgment-free global space to share authentically. Identity is protected by cryptographic shield avatars.
- **Support Circles** — Private and public communities organized around specific struggles like Anxiety, Grief, or Burnout.
- **AI Listener History** — A secure, persistent AI companion available 24/7 for validates conversation and private support.
- **Real-Time Presence** — High-accuracy member tracking using Supabase Presence channels to see active support in real time.
- **Encrypted-Ready Video Calls** — Built-in Jitsi Meet integration for instant, peer-to-peer video support sessions.
- **Micro-Empathy Reactions** — Instant supportive interactions ("I hear you", "Warmth") designed 	to validate without the pressure of a full reply.
- **Secure File Sharing** — Share images and documents directly within circles to provide deeper context or resources.
- **Premium User Experience** — A stunning, motion-driven UI featuring custom "Forest & Sage" light and dark modes.

---

## Technology Architecture

WithMe is built with a focus on privacy-first architecture and modern responsive design.

**Frontend Engineering:**
* **React 18 + Vite** for a highly optimized, lightning-fast user interface.
* **Context API & Hooks** for sophisticated state management across auth and theme layers.
* **Vanilla CSS (Design System)** — A custom-engineered CSS variable system utilizing glassmorphism and motion-blur background orbs.
* **Lucide Iconography** — High-fidelity SVG icons for a consistent, professional visual language.

**Backend Infrastructure (Supabase):**
* **Relational PostgreSQL** — Normalized data structures for circles, memberships, and real-time messaging.
* **Real-time Engine** — Full-duplex websocket communication for instant message delivery and presence sync.
* **Advanced RLS Policies** — Strict Row Level Security ensuring complete data isolation and user privacy.
* **Cloud Storage** — Scalable buckets for user avatars and encrypted attachments.

---

## System Requirements & Local Setup

### 1. Repository Initialization
```bash
git clone https://github.com/alhosseinjr/withme.git
cd withme
npm install
```

### 2. Database Provisioning
1. Initialize a new project in [Supabase](https://supabase.com).
2. Execute the `SUPABASE_SETUP.sql` script in the SQL Editor. This initializes the schema, RLS policies, and triggers.
3. Provisions two public storage buckets: `avatars` and `attachments`.

### 3. Environment Configuration
Update your environment variables in `src/lib/supabase.js` or via a `.env.local` file:
```js
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GROQ_API_KEY=your-groq-key
```

### 4. Development Execution
```bash
npm run dev
```
The application will launch at **http://localhost:5173**.

---
<div align="center">
  <p>Engineering & Design by <a href="https://github.com/alhosseinjr">alhosseinjr</a></p>
</div>
