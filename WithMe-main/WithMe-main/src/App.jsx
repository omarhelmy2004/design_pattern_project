import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Handshake } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Layout from './components/Layout';
import WelcomePage from './pages/WelcomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import CirclesPage from './pages/CirclesPage';
import CircleDetailPage from './pages/CircleDetailPage';
import CheckInPage from './pages/CheckInPage';
import VentPage from './pages/VentPage';
import CompanionPage from './pages/CompanionPage';
import ProfilePage from './pages/ProfilePage';

function AppRoutes() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="brand-mark"><Handshake size={28} color="#fff" /></div>
        <div className="spinner" style={{ color: 'var(--primary)' }} />
      </div>
    );
  }

  const isAuthenticated = !!user;
  const hasOnboarded = profile?.onboarded;

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  if (!hasOnboarded) {
    return (
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/circles" element={<CirclesPage />} />
        <Route path="/circles/:circleId" element={<CircleDetailPage />} />
        <Route path="/checkin" element={<CheckInPage />} />
        <Route path="/vent" element={<VentPage />} />
        <Route path="/companion" element={<CompanionPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/circles" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}
