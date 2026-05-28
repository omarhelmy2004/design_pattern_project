import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Loader } from 'lucide-react';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, loading, error } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await signup();
      navigate('/onboarding');
    } catch (err) {
      console.error('Signup failed:', err);
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
            Create Account
          </h1>
          <p style={{ color: 'var(--text)', fontSize: 'var(--font-size-sm)' }}>
            Join WithMe anonymously
          </p>
        </div>

        <form onSubmit={handleSignup}>
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

          <p style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--text)',
            marginBottom: 'var(--spacing-lg)',
            lineHeight: 1.6
          }}>
            Your account will be completely anonymous. No personal information is required or stored.
          </p>

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
            {isSubmitting || loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
            <p style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-sm)' }}>
              Already have an account?
            </p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="btn-outline"
              style={{
                width: '100%',
                padding: 'var(--spacing-md)',
                fontSize: 'var(--font-size-base)'
              }}
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
