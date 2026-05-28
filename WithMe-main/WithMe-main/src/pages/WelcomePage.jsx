import React from 'react';
import { Link } from 'react-router-dom';
import { Handshake, ArrowRight, Shield, Users, Heart, Sparkles, MessageCircle } from 'lucide-react';
import './WelcomePage.css';

const FEATURES = [
  { icon: Users, title: 'Support Circles', desc: 'Join specific communities organized exactly by what you\'re navigating right now.' },
  { icon: Shield, title: 'Private & Secure', desc: 'Your identity is protected. Share openly and authentically without fear of judgment.' },
  { icon: Heart, title: 'Real Human Empathy', desc: 'No generic advice—just genuine validation from peers who truly understand your journey.' },
  { icon: Sparkles, title: 'AI Listener', desc: 'Access an empathetic AI companion anytime for private, validating conversation when no one else is around.' },
];

export default function WelcomePage() {
  return (
    <>
      {/* Premium Animated Background from our global theme */}
      <div className="animated-bg-container">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
      </div>

      <div className="welcome-page">
        {/* Navigation Bar */}
        <nav className="welcome-nav card-glass">
          <div className="welcome-brand">
            <Handshake size={24} color="var(--primary)" />
            <span className="brand-text">WithMe</span>
          </div>
          <div className="welcome-nav-actions">
            <Link to="/login" className="btn-ghost">Log in</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Sign up free</Link>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="welcome-hero-section">
          <div className="hero-content fade-in">
            <div className="hero-badge badge badge-primary" style={{ marginBottom: 24 }}>
              <Sparkles size={14} /> The safest corner of the internet
            </div>
            <h1 className="hero-title">
              You don't have to go through it <span className="text-gradient">alone.</span>
            </h1>
            <p className="hero-tagline">
              A premium, completely private peer-support network. Connect anonymously with people experiencing the exact same struggles as you.
            </p>
            
            <div className="welcome-actions" style={{ marginTop: 40, justifyContent: 'center' }}>
              <Link to="/signup" className="btn btn-primary btn-lg welcome-btn">
                Join the community <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </main>

        {/* Features / Value Proposition */}
        <section className="welcome-features-section fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card card card-glass card-hover">
                <div className="feature-icon-wrap" style={{ background: 'var(--primary-muted)', color: 'var(--primary)' }}>
                  <f.icon size={24} />
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="welcome-footer card-glass">
          <p>© 2026 WithMe. A peer support community, not a substitute for professional clinical help.</p>
        </footer>
      </div>
    </>
  );
}
