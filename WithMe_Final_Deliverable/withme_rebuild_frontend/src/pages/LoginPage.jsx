import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Loader } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [anonymousId, setAnonymousId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!anonymousId.trim()) {
      alert('Please enter your anonymous ID');
      return;
    }
    try {
      setIsSubmitting(true);
      await login(anonymousId);
      navigate('/circles');
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 'var(--spacing-lg)'
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
          <Heart size={48} style={{ color: 'var(--primary)', margin: '0 auto', marginBottom: 'var(--spacing-md)' }} />
          <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-sm)' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text)', fontSize: 'var(--font-size-sm)' }}>
            Sign in to your anonymous account
          </p>
        </div>

        <form onSubmit={handleLogin}>
          {error && (
            <div style={{
              backgroundColor: 'var(--danger)',
              color: 'white',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--spacing-md)',
              fontSize: 'var(--font-size-sm)'
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label style={{
              display: 'block',
              marginBottom: 'var(--spacing-sm)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 600
            }}>
              Anonymous ID
            </label>
            <input
              type="text"
              value={anonymousId}
              onChange={(e) => setAnonymousId(e.target.value)}
              placeholder="Enter your anonymous ID"
              style={{
                width: '100%',
                padding: 'var(--spacing-md)',
                fontSize: 'var(--font-size-base)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                color: 'var(--text)'
              }}
            />
            <p style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--text)',
              marginTop: 'var(--spacing-sm)'
            }}>
              You received this when you created your account
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="btn-primary"
            style={{
              width: '100%',
              padding: 'var(--spacing-md)',
              fontSize: 'var(--font-size-base)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              opacity: isSubmitting || loading ? 0.6 : 1
            }}
          >
            {isSubmitting || loading ? <Loader size={20} className="animate-spin" /> : null}
            {isSubmitting || loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
            <p style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-sm)' }}>
              Don't have an account?
            </p>
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="btn-outline"
              style={{
                width: '100%',
                padding: 'var(--spacing-md)',
                fontSize: 'var(--font-size-base)'
              }}
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
