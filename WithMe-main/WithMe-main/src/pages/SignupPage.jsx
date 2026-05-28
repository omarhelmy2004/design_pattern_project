import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './AuthPage.css';

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !password.trim()) { setError('Please fill in all fields'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }

    setLoading(true);
    const { data, error: err } = await supabase.auth.signUp({
      email: email.trim(), password,
      options: { data: { display_name: name.trim() } },
    });
    if (err) { setError(err.message); setLoading(false); return; }
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id, display_name: name.trim(), email: email.trim(), onboarded: false,
      });
    }
    setLoading(false);
    navigate('/onboarding');
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
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Free forever for the essentials.</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSignup} className="auth-form">
          <div className="form-group">
            <label className="input-label" htmlFor="s-name">Display name</label>
            <input id="s-name" className="input" type="text" placeholder="Alex, or stay Anonymous" value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
          </div>
          <div className="form-group">
            <label className="input-label" htmlFor="s-email">Email</label>
            <input id="s-email" className="input" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div className="form-group">
            <label className="input-label" htmlFor="s-pass">Password</label>
            <input id="s-pass" className="input" type="password" placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
          </div>
          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create account'}
          </button>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </form>
      </div>
    </div>
    </>
  );
}
