import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { MOODS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/Icon';
import { format } from 'date-fns';
import './CheckInPage.css';

const PROMPTS = [
  "What's weighing on you most right now?",
  "What's one small thing that felt okay today?",
  "If you could tell someone how you're feeling, what would you say?",
  "What do you need most right now?",
  "What's one thing you're proud of, even if it feels small?",
];

export default function CheckInPage() {
  const { user } = useAuth();
  const [mood, setMood] = useState(null);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [todaysCheckins, setTodaysCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const today = format(new Date(), 'yyyy-MM-dd');
  const prompt = PROMPTS[new Date().getDay() % PROMPTS.length];

  const fetchToday = useCallback(async () => {
    const { data: mine } = await supabase.from('check_ins').select('*').eq('user_id', user.id).eq('check_in_date', today).single();
    if (mine) setSubmitted(true);
    const { data: others } = await supabase.from('check_ins').select('mood_score, note, profiles(display_name)').eq('check_in_date', today).neq('user_id', user.id).limit(20);
    setTodaysCheckins(others || []);
    setLoading(false);
  }, [user, today]);

  useEffect(() => { fetchToday(); }, [fetchToday]);

  const submit = async () => {
    if (!mood) return;
    setSubmitting(true);
    await supabase.from('check_ins').upsert({ user_id: user.id, check_in_date: today, mood_score: mood, note: note.trim() || null });
    setSubmitted(true); fetchToday(); setSubmitting(false);
  };

  if (loading) return <div className="page-content" style={{ display: 'flex', justifyContent: 'center', paddingTop: 120 }}><div className="spinner" style={{ color: 'var(--primary)', width: 28, height: 28 }} /></div>;

  return (
    <div className="page-content fade-in">
      <div className="page-header">
        <span className="ci-date">{format(new Date(), 'EEEE, MMMM d')}</span>
        <h2>Daily check-in</h2>
      </div>

      {!submitted ? (
        <div className="ci-form card">
          <p className="ci-prompt">"{prompt}"</p>
          <p className="ci-label">How are you feeling today?</p>
          <div className="mood-row">
            {MOODS.map((m) => (
              <button key={m.score} className={`mood-btn${mood === m.score ? ' active' : ''}`} onClick={() => setMood(m.score)}
                style={mood === m.score ? { borderColor: m.color, background: m.color + '18' } : undefined}>
                <div className="mood-icon-wrap" style={{ color: mood === m.score ? m.color : 'var(--text-tertiary)' }}>
                  <Icon name={m.icon} size={24} />
                </div>
                <span className="mood-label" style={mood === m.score ? { color: m.color } : undefined}>{m.label}</span>
              </button>
            ))}
          </div>
          <p className="ci-label">Want to share more?</p>
          <textarea className="input ci-note" placeholder="Shared anonymously with your circles..." value={note} onChange={(e) => setNote(e.target.value)} maxLength={280} />
          <div className="ci-note-footer">
            <span className="ci-char">{note.length}/280</span>
          </div>
          <button className="btn btn-primary btn-lg ci-submit" onClick={submit} disabled={!mood || submitting}>
            {submitting ? <span className="spinner" /> : 'Share with my circles'}
          </button>
        </div>
      ) : (
        <div className="ci-done card-glass">
          <Icon name="Check" size={32} style={{ color: 'var(--accent)' }} />
          <h3>You checked in today</h3>
          <p className="ci-done-desc">Come back tomorrow. You're building a valuable habit.</p>
        </div>
      )}

      {todaysCheckins.length > 0 && (
        <div className="ci-community">
          <h3 className="ci-community-title">Others in your circles</h3>
          <p className="ci-community-sub">Shared anonymously</p>
          <div className="ci-community-list">
            {todaysCheckins.map((c, i) => {
              const m = MOODS.find((x) => x.score === c.mood_score);
              return (
                <div key={i} className="ci-community-card card">
                  <div className="ci-community-mood" style={{ color: m?.color }}>
                    <Icon name={m?.icon || 'Minus'} size={18} />
                    <span>{m?.label || 'Checked in'}</span>
                  </div>
                  {c.note && <p className="ci-community-note">"{c.note}"</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
