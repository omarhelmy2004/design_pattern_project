import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');

  const handleComplete = () => {
    navigate('/circles');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 'var(--spacing-lg)'
    }}>
      <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
          <Heart size={48} style={{ color: 'var(--primary)', margin: '0 auto', marginBottom: 'var(--spacing-md)' }} />
          <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-md)' }}>
            Welcome to WithMe
          </h1>
          <p style={{ color: 'var(--text)', fontSize: 'var(--font-size-base)' }}>
            Let's set up your profile
          </p>
        </div>

        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <label style={{
            display: 'block',
            marginBottom: 'var(--spacing-sm)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 600
          }}>
            Display Name (Optional)
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Choose a display name"
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
        </div>

        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)' }}>About WithMe</h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            fontSize: 'var(--font-size-sm)',
            lineHeight: 1.8
          }}>
            <li style={{ marginBottom: 'var(--spacing-md)' }}>
              ✓ Complete anonymity - no personal data required
            </li>
            <li style={{ marginBottom: 'var(--spacing-md)' }}>
              ✓ Support circles for shared struggles
            </li>
            <li style={{ marginBottom: 'var(--spacing-md)' }}>
              ✓ 24/7 AI companion for emotional support
            </li>
            <li>
              ✓ Daily mood tracking with streak rewards
            </li>
          </ul>
        </div>

        <button
          onClick={handleComplete}
          className="btn-primary"
          style={{
            width: '100%',
            padding: 'var(--spacing-md)',
            fontSize: 'var(--font-size-base)'
          }}
        >
          Continue to WithMe
        </button>
      </div>
    </div>
  );
}
