import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Handshake } from 'lucide-react';

// Pages
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
import Layout from './components/Layout';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-center" style={{ height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <Handshake size={48} style={{ marginBottom: '1rem' }} />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const isAuthenticated = !!user;

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

  return (
    <Routes>
      <Route path="/onboarding" element={<OnboardingPage />} />
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
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
