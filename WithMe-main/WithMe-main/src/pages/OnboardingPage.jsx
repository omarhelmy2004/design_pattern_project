import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { STRUGGLES } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/Icon';
import './OnboardingPage.css';

export default function OnboardingPage() {
  const { user, refreshProfile } = useAuth();
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggle = (id) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

  const handleContinue = async () => {
    if (selected.length === 0) { setError('Pick at least one — you can change this anytime.'); return; }
    setLoading(true);
    const { error: err } = await supabase.from('profiles').update({ struggles: selected, onboarded: true }).eq('id', user.id);
    if (err) { setError(err.message); setLoading(false); return; }
    await refreshProfile();
    setLoading(false);
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-container fade-in">
        <span className="onboarding-step badge badge-primary">Step 1 of 1</span>
        <h1 className="onboarding-title">What are you going through?</h1>
        <p className="onboarding-subtitle">
          We'll match you with people who understand. Choose everything that fits.
        </p>

        {error && <div className="auth-error">{error}</div>}

        <div className="onboarding-grid">
          {STRUGGLES.map((s) => {
            const isSelected = selected.includes(s.id);
            return (
              <button
                key={s.id}
                className={`onb-card card${isSelected ? ' selected' : ''}`}
                onClick={() => toggle(s.id)}
                style={isSelected ? { borderColor: s.color, background: s.color + '12' } : undefined}
              >
                <div className="onb-card-icon" style={{ backgroundColor: s.color + '20', color: s.color }}>
                  <Icon name={s.icon} size={20} />
                </div>
                <div className="onb-card-body">
                  <span className="onb-card-label" style={isSelected ? { color: s.color } : undefined}>{s.label}</span>
                  <span className="onb-card-desc">{s.desc}</span>
                </div>
                {isSelected && (
                  <span className="onb-check" style={{ background: s.color }}><Check size={12} /></span>
                )}
              </button>
            );
          })}
        </div>

        <div className="onboarding-note card-glass">
          <Icon name="Lock" size={14} style={{ flexShrink: 0, color: 'var(--accent)' }} />
          This is private. Only you and your circle members can see it.
        </div>

        <button className="btn btn-primary btn-lg onboarding-submit" onClick={handleContinue} disabled={loading || selected.length === 0}>
          {loading ? <span className="spinner" /> : 'Find my circles'}
        </button>
      </div>
    </div>
  );
}
