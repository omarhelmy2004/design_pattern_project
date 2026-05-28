import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X, Shield, MessageCircle, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { REACTIONS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/Icon';
import { formatDistanceToNow } from 'date-fns';
import { generateEmpathyReply } from '../lib/groq';
import './VentPage.css';

export default function VentPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [ventText, setVentText] = useState('');
  const [posting, setPosting] = useState(false);
  const [aiReplies, setAiReplies] = useState({});
  const [aiLoading, setAiLoading] = useState({});

  const fetchPosts = useCallback(async () => {
    const { data } = await supabase.from('vents').select('*, vent_reactions(reaction_type, user_id)').order('created_at', { ascending: false }).limit(50);
    setPosts(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const submitVent = async () => {
    if (!ventText.trim()) return;
    setPosting(true);
    await supabase.from('vents').insert({ user_id: user.id, content: ventText.trim() });
    setVentText(''); setShowCompose(false); fetchPosts();
    setPosting(false);
  };

  const toggleReaction = async (ventId, reactionType) => {
    const vent = posts.find((p) => p.id === ventId);
    const existing = vent?.vent_reactions?.find((r) => r.user_id === user.id && r.reaction_type === reactionType);
    if (existing) {
      await supabase.from('vent_reactions').delete().eq('vent_id', ventId).eq('user_id', user.id).eq('reaction_type', reactionType);
    } else {
      await supabase.from('vent_reactions').insert({ vent_id: ventId, user_id: user.id, reaction_type: reactionType });
    }
    fetchPosts();
  };

  const handleAiSupport = async (ventId, content) => {
    if (aiReplies[ventId] || aiLoading[ventId]) return;
    setAiLoading(prev => ({ ...prev, [ventId]: true }));
    const reply = await generateEmpathyReply(content);
    setAiReplies(prev => ({ ...prev, [ventId]: reply }));
    setAiLoading(prev => ({ ...prev, [ventId]: false }));
  };

  return (
    <div className="page-content fade-in">
      <div className="vent-header-row">
        <div>
          <h2>Vent Space</h2>
          <p className="page-header-sub">Anonymous. Judgment-free. Reactions only.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowCompose(true)}>
          <Plus size={16} /> New vent
        </button>
      </div>

      <div className="vent-rules card-glass">
        <Shield size={14} style={{ flexShrink: 0, color: 'var(--primary)' }} />
        Reactions only — no advice, no debates. Just "I hear you."
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
          <div className="spinner" style={{ color: 'var(--primary)', width: 28, height: 28 }} />
        </div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <MessageCircle className="empty-icon" />
          <div className="empty-title">Nothing here yet</div>
          <div className="empty-desc">Be the first to share. It's completely anonymous.</div>
          <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => setShowCompose(true)}>Share something</button>
        </div>
      ) : (
        <div className="vent-list">
          {posts.map((item) => {
            const timeAgo = formatDistanceToNow(new Date(item.created_at), { addSuffix: true });
            return (
              <div key={item.id} className="vent-card card">
                <div className="vent-meta">
                  <div className="vent-anon">
                    <div className="avatar avatar-xs"><Shield size={12} /></div>
                    <span>Anonymous</span>
                  </div>
                  <span className="vent-time">{timeAgo}</span>
                </div>
                <p className="vent-content">{item.content}</p>
                <div className="vent-reactions">
                  {REACTIONS.map((r) => {
                    const count = (item.vent_reactions || []).filter((x) => x.reaction_type === r.id).length;
                    const reacted = (item.vent_reactions || []).some((x) => x.reaction_type === r.id && x.user_id === user.id);
                    return (
                      <button key={r.id} className={`reaction-chip${reacted ? ' active' : ''}`} onClick={() => toggleReaction(item.id, r.id)}>
                        <Icon name={r.icon} size={13} />
                        <span className="reaction-label-text">{count > 0 ? `${count} ` : ''}{r.label}</span>
                      </button>
                    );
                  })}
                  <button 
                    className={`reaction-chip ${aiReplies[item.id] ? 'active' : ''}`} 
                    onClick={() => handleAiSupport(item.id, item.content)}
                    disabled={!!aiReplies[item.id]}
                    style={aiReplies[item.id] ? { background: 'var(--primary-muted)', borderColor: 'var(--primary-glow)', color: 'var(--primary)' } : {}}
                  >
                    {aiLoading[item.id] ? (
                      <span className="spinner" style={{ width: 13, height: 13 }} />
                    ) : (
                      <>
                        <Sparkles size={13} style={{ color: aiReplies[item.id] ? 'var(--primary)' : 'inherit' }} />
                        <span className="reaction-label-text">AI Support</span>
                      </>
                    )}
                  </button>
                </div>
                {aiReplies[item.id] && (
                  <div className="vent-ai-reply fade-in">
                    <div className="vent-ai-reply-header">
                      <Sparkles size={12} />
                      <span>AI Compassion (Private to you)</span>
                    </div>
                    <p>{aiReplies[item.id]}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Compose Modal */}
      {showCompose && (
        <div className="modal-overlay" onClick={() => setShowCompose(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <button className="btn btn-ghost btn-sm" onClick={() => setShowCompose(false)}>Cancel</button>
              <h3>Share anonymously</h3>
              <button className="btn btn-primary btn-sm" onClick={submitVent} disabled={!ventText.trim() || posting}>
                {posting ? <span className="spinner" style={{ width: 14, height: 14 }} /> : 'Post'}
              </button>
            </div>
            <div className="modal-body">
              <div className="vent-anon-banner card-glass">
                <Icon name="Lock" size={14} style={{ flexShrink: 0, color: 'var(--accent)' }} />
                100% anonymous. Nobody will know it's you.
              </div>
              <textarea className="input vent-textarea" placeholder="What's on your mind? Let it out..." value={ventText} onChange={(e) => setVentText(e.target.value)} maxLength={500} autoFocus />
              <span className="vent-char">{ventText.length}/500</span>
              <div className="vent-reminder card-glass">
                <strong>Remember</strong>
                <p>Others respond with reactions only — no advice, no judgment. A space to be heard.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
