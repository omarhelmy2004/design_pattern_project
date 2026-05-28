import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './AuthPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) { setError('Please enter email and password'); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (err) setError(err.message);
    setLoading(false);
  };

  return (
    <>
      {/* Premium Animated Background */}
      <div className="animated-bg-container">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
      </div>
      <div className="auth-page">
        <div className="auth-container fade-in card-glass" style={{ padding: '40px 32px' }}>
        <Link to="/" className="auth-back"><ArrowLeft size={16} /> Back</Link>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">We're glad you're here.</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label className="input-label" htmlFor="l-email">Email</label>
            <input id="l-email" className="input" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div className="form-group">
            <label className="input-label" htmlFor="l-pass">Password</label>
            <input id="l-pass" className="input" type="password" placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Sign in'}
          </button>
          <p className="auth-switch">Don't have an account? <Link to="/signup">Create one free</Link></p>
        </form>
      </div>
    </div>
    </>
  );
}
