import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Camera, Edit3, LogOut, Bell, Lock, Zap, ExternalLink, CalendarCheck, MessageCircle, MessageSquare, TrendingUp, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { STRUGGLES } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/Icon';
import { generateDailyInsight } from '../lib/groq';
import './ProfilePage.css';

const getStruggle = (id) => STRUGGLES.find((s) => s.id === id);

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const [stats, setStats] = useState({ checkins: 0, posts: 0, vents: 0 });
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [insight, setInsight] = useState(null);
  const [insightLoading, setInsightLoading] = useState(true);
  const fileRef = useRef(null);

  const fetchStatsAndInsights = useCallback(async () => {
    // 1. Fetch aggregate stats
    const [{ count: checkins }, { count: posts }, { count: vents }] = await Promise.all([
      supabase.from('check_ins').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('posts').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('vents').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    ]);
    setStats({ checkins: checkins || 0, posts: posts || 0, vents: vents || 0 });
    setLoading(false);

    // 2. Fetch recent check-ins for AI insight
    const { data: recentCheckins } = await supabase.from('check_ins')
      .select('*').eq('user_id', user.id).order('check_in_date', { ascending: false }).limit(14);
    
    if (recentCheckins && recentCheckins.length > 0) {
      const aiInsight = await generateDailyInsight(recentCheckins);
      setInsight(aiInsight);
    }
    setInsightLoading(false);
  }, [user]);

  useEffect(() => { fetchStatsAndInsights(); }, [fetchStatsAndInsights]);

  const saveName = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    await supabase.from('profiles').update({ display_name: newName.trim() }).eq('id', user.id);
    await refreshProfile();
    setEditingName(false);
    setSaving(false);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB'); return; }

    setUploadingPhoto(true);
    const ext = file.name.split('.').pop();
    const path = `avatars/${user.id}.${ext}`;

    // Try upload, may fail if bucket doesn't exist
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (error) {
      // Create a local preview URL as fallback
      const localUrl = URL.createObjectURL(file);
      await supabase.from('profiles').update({ avatar_url: localUrl }).eq('id', user.id);
    } else {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', user.id);
    }
    await refreshProfile();
    setUploadingPhoto(false);
    e.target.value = '';
  };

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      supabase.auth.signOut();
    }
  };

  const initials = (profile?.display_name || 'A').split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  const avatarUrl = profile?.avatar_url;

  return (
    <div className="page-content fade-in">
      <h2 className="profile-title">Profile</h2>

      {/* Avatar + name */}
      <div className="profile-hero card">
        <div className="profile-avatar-wrap">
          <div className="avatar avatar-xl">
            {avatarUrl ? <img src={avatarUrl} alt={profile?.display_name} /> : initials}
            <span className="status-dot status-online" />
          </div>
          <input type="file" ref={fileRef} accept="image/*" className="hidden-input" onChange={handlePhotoUpload} />
          <button className="avatar-upload-btn" onClick={() => fileRef.current?.click()} disabled={uploadingPhoto}>
            {uploadingPhoto ? <span className="spinner" style={{ width: 12, height: 12, color: '#fff' }} /> : <Camera size={14} />}
          </button>
        </div>

        {editingName ? (
          <div className="profile-edit-row">
            <input className="input" style={{ maxWidth: 200, textAlign: 'center' }} value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Your name" autoFocus />
            <button className="btn btn-primary btn-sm" onClick={saveName} disabled={saving}>
              {saving ? <span className="spinner" style={{ width: 14, height: 14 }} /> : 'Save'}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setEditingName(false)}>Cancel</button>
          </div>
        ) : (
          <button className="profile-name-btn" onClick={() => { setNewName(profile?.display_name || ''); setEditingName(true); }}>
            <span className="profile-display-name">{profile?.display_name || 'Anonymous'}</span>
            <Edit3 size={14} className="profile-edit-icon" />
          </button>
        )}
        <span className="profile-email">{user?.email}</span>
      </div>

      {/* Stats */}
      <div className="profile-section-header">
        <TrendingUp size={16} />
        <h3>Your journey</h3>
      </div>
      <div className="profile-stats">
        {[
          { label: 'Check-ins', value: stats.checkins, icon: CalendarCheck, color: 'var(--primary)' },
          { label: 'Circle posts', value: stats.posts, icon: MessageSquare, color: 'var(--accent)' },
          { label: 'Vents shared', value: stats.vents, icon: MessageCircle, color: '#A78BFA' },
        ].map((s) => (
          <div key={s.label} className="stat-card card">
            <s.icon size={18} style={{ color: s.color }} />
            <span className="stat-num">{loading ? '—' : s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* AI Insights Card */}
      <div className="profile-section-header">
        <Sparkles size={16} style={{ color: 'var(--primary)' }} />
        <h3>AI Insights</h3>
      </div>
      <div className="card-glass ai-insight-card">
        {insightLoading ? (
          <div className="ai-insight-loading">
            <span className="spinner" style={{ color: 'var(--primary)', width: 14, height: 14 }} />
            <span>Analyzing your recent check-ins...</span>
          </div>
        ) : insight ? (
          <p className="ai-insight-text">{insight}</p>
        ) : (
          <p className="ai-insight-empty">Check in for a few days to unlock personalized AI insights about your mood patterns.</p>
        )}
      </div>

      {/* Struggles */}
      {profile?.struggles?.length > 0 && (
        <>
          <div className="profile-section-header">
            <Icon name="Heart" size={16} />
            <h3>Working through</h3>
          </div>
          <div className="profile-struggles">
            {profile.struggles.map((id) => {
              const s = getStruggle(id);
              if (!s) return null;
              return (
                <span key={id} className="struggle-chip" style={{ background: s.color + '18', borderColor: s.color + '40', color: s.color }}>
                  <Icon name={s.icon} size={13} /> {s.label}
                </span>
              );
            })}
          </div>
        </>
      )}

      {/* Settings */}
      <div className="profile-section-header">
        <Icon name="Settings" size={16} />
        <h3>Settings</h3>
      </div>
      <div className="settings-card card">
        <button className="settings-row"><Bell size={16} /><span className="settings-text">Notifications</span><ExternalLink size={14} className="settings-arrow" /></button>
        <div className="settings-divider" />
        <button className="settings-row"><Lock size={16} /><span className="settings-text">Privacy</span><ExternalLink size={14} className="settings-arrow" /></button>
        <div className="settings-divider" />
        <button className="settings-row"><Zap size={16} style={{ color: 'var(--primary)' }} /><span className="settings-text">Upgrade to Pro</span><span className="badge badge-primary">$7.99/mo</span></button>
      </div>

      {/* Crisis */}
      <div className="crisis-card card">
        <h4 className="crisis-title">Need immediate help?</h4>
        <p className="crisis-text">
          If you're in crisis, please reach out to a professional.<br />
          988 Suicide & Crisis Lifeline: call or text 988<br />
          International: findahelpline.com
        </p>
      </div>

      <button className="btn btn-danger profile-signout" onClick={handleSignOut}>
        <LogOut size={16} /> Sign out
      </button>

      <p className="profile-version">WithMe v2.0 · Premium Edition</p>
    </div>
  );
}
