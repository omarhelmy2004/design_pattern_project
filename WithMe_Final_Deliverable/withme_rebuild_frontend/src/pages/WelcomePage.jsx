import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Zap, MessageCircle } from 'lucide-react';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 'var(--spacing-lg)',
      color: 'white'
    }}>
      <div style={{ maxWidth: '600px', textAlign: 'center' }}>
        {/* Logo */}
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <Heart size={64} style={{ margin: '0 auto', marginBottom: 'var(--spacing-lg)' }} />
          <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-md)' }}>
            WithMe
          </h1>
          <p style={{ fontSize: 'var(--font-size-lg)', opacity: 0.9 }}>
            A safe, anonymous space for emotional support and connection
          </p>
        </div>

        {/* Features */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-2xl)',
          marginTop: 'var(--spacing-2xl)'
        }}>
          <div className="card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: 'none' }}>
            <Users size={32} style={{ marginBottom: 'var(--spacing-md)' }} />
            <h3 style={{ color: 'white', marginBottom: 'var(--spacing-sm)' }}>Support Circles</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', opacity: 0.9 }}>
              Join communities around shared struggles
            </p>
          </div>

          <div className="card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: 'none' }}>
            <MessageCircle size={32} style={{ marginBottom: 'var(--spacing-md)' }} />
            <h3 style={{ color: 'white', marginBottom: 'var(--spacing-sm)' }}>AI Companion</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', opacity: 0.9 }}>
              24/7 empathetic listener for support
            </p>
          </div>

          <div className="card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: 'none' }}>
            <Zap size={32} style={{ marginBottom: 'var(--spacing-md)' }} />
            <h3 style={{ color: 'white', marginBottom: 'var(--spacing-sm)' }}>Anonymous Venting</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', opacity: 0.9 }}>
              Share freely without revealing identity
            </p>
          </div>

          <div className="card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: 'none' }}>
            <Heart size={32} style={{ marginBottom: 'var(--spacing-md)' }} />
            <h3 style={{ color: 'white', marginBottom: 'var(--spacing-sm)' }}>Daily Check-ins</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', opacity: 0.9 }}>
              Track your mood and build streaks
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-md)',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => navigate('/signup')}
            className="btn-primary"
            style={{
              padding: 'var(--spacing-md) var(--spacing-xl)',
              fontSize: 'var(--font-size-lg)',
              backgroundColor: 'white',
              color: 'var(--primary)'
            }}
          >
            Get Started
          </button>
          <button
            onClick={() => navigate('/login')}
            className="btn-outline"
            style={{
              padding: 'var(--spacing-md) var(--spacing-xl)',
              fontSize: 'var(--font-size-lg)',
              borderColor: 'white',
              color: 'white'
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
