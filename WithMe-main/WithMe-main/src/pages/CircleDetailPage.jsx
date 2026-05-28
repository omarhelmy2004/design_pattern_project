import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Paperclip, Phone, Video, Users, X, FileText, Image as ImageIcon, File as FileIcon, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { REACTIONS, STRUGGLES } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/Icon';
import { formatDistanceToNow } from 'date-fns';
import './CircleDetailPage.css';

const getStruggle = (id) => STRUGGLES.find((s) => s.id === id) || {};

// Format file size
const formatBytes = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
};

// Get file icon
const getFileIcon = (type) => {
  if (type?.startsWith('image/')) return ImageIcon;
  if (type?.includes('pdf') || type?.includes('document')) return FileText;
  return FileIcon;
};

export default function CircleDetailPage() {
  const { circleId } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [circle, setCircle] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [attachment, setAttachment] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showCallUI, setShowCallUI] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const fetchData = useCallback(async () => {
    const [{ data: circleData }, { data: memberData }, { data: postsData }] = await Promise.all([
      supabase.from('circles').select('*').eq('id', circleId).single(),
      supabase.from('circle_members').select('id').eq('circle_id', circleId).eq('user_id', user.id).limit(1),
      supabase.from('posts').select('*, post_reactions(reaction_type, user_id)').eq('circle_id', circleId).order('created_at', { ascending: true }),
    ]);
    setCircle(circleData);
    setIsMember(memberData && memberData.length > 0);
    setPosts(postsData || []);
    setLoading(false);
  }, [circleId, user]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [posts]);

  useEffect(() => {
    if (!profile) return;
    const channel = supabase.channel(`circle-${circleId}`, { 
      config: { presence: { key: user.id } } 
    });

    channel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts', filter: `circle_id=eq.${circleId}` }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_reactions' }, fetchData)
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users = Object.values(state).flat().map(p => p.profile);
        // Only keep unique users by ID in case of multiple tabs
        const unique = Array.from(new Map(users.map(item => [item.id, item])).values());
        setOnlineUsers(unique);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ 
            profile: { id: user.id, display_name: profile.display_name, avatar_url: profile.avatar_url }
          });
        }
      });

    return () => supabase.removeChannel(channel);
  }, [circleId, fetchData, user.id, profile]);

  const handleJoin = async () => {
    if (isMember) return;
    setIsMember(true);
    await supabase.from('circle_members').insert({ circle_id: circleId, user_id: user.id });
    fetchData();
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert('File must be under 10MB'); return; }
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `circle-files/${circleId}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from('attachments').upload(path, file);
    if (error) {
      // Storage bucket may not exist yet — store file metadata anyway
      setAttachment({ name: file.name, size: file.size, type: file.type, url: null });
    } else {
      const { data: urlData } = supabase.storage.from('attachments').getPublicUrl(path);
      setAttachment({ name: file.name, size: file.size, type: file.type, url: urlData.publicUrl });
    }
    setUploading(false);
    e.target.value = '';
  };

  const submitPost = async (e) => {
    e.preventDefault();
    if (!newPost.trim() && !attachment) return;
    setPosting(true);

    let content = newPost.trim();
    if (attachment) {
      const fileRef = attachment.url
        ? `\n[FILE:${attachment.name}|${attachment.size}|${attachment.type}|${attachment.url}]`
        : `\n[FILE:${attachment.name}|${attachment.size}|${attachment.type}]`;
      content += fileRef;
    }

    await supabase.from('posts').insert({
      circle_id: circleId, user_id: user.id,
      content, is_anonymous: true, author_name: profile?.display_name || 'Anonymous',
    });
    setNewPost(''); setAttachment(null); fetchData();
    setPosting(false);
  };

  const toggleReaction = async (postId, reactionType) => {
    const post = posts.find((p) => p.id === postId);
    const existing = post?.post_reactions?.find((r) => r.user_id === user.id && r.reaction_type === reactionType);
    if (existing) {
      await supabase.from('post_reactions').delete().eq('post_id', postId).eq('user_id', user.id).eq('reaction_type', reactionType);
    } else {
      await supabase.from('post_reactions').insert({ post_id: postId, user_id: user.id, reaction_type: reactionType });
    }
    fetchData();
  };

  // Parse file attachment from post content
  const parsePost = (content) => {
    const fileMatch = content.match(/\[FILE:(.+?)\|(\d+)\|(.+?)(?:\|(.+?))?\]$/);
    if (!fileMatch) return { text: content, file: null };
    return {
      text: content.replace(/\n?\[FILE:.+\]$/, '').trim(),
      file: { name: fileMatch[1], size: parseInt(fileMatch[2]), type: fileMatch[3], url: fileMatch[4] },
    };
  };

  if (loading) return (
    <div className="page-content" style={{ display: 'flex', justifyContent: 'center', paddingTop: 120 }}>
      <div className="spinner" style={{ color: 'var(--primary)', width: 28, height: 28 }} />
    </div>
  );

  const struggle = getStruggle(circle?.struggle_type);

  return (
    <div className="cd-page">
      {/* Header */}
      <div className="cd-header">
        <button className="btn-ghost cd-back" onClick={() => navigate('/circles')}><ArrowLeft size={18} /></button>
        <div className="cd-header-info">
          <div className="cd-header-icon" style={{ background: (struggle.color || 'var(--primary)') + '18', color: struggle.color || 'var(--primary)' }}>
            {struggle.icon ? <Icon name={struggle.icon} size={18} /> : <Users size={18} />}
          </div>
          <div>
            <h3 className="cd-header-name">{circle?.name}</h3>
            <p className="cd-header-desc">{circle?.description}</p>
          </div>
        </div>
        <div className="cd-header-actions">
          {circle?.is_private && isMember && (
            <button className="btn btn-secondary btn-sm" onClick={() => {
              navigator.clipboard.writeText(circle.id);
              alert('Circle ID copied to clipboard: ' + circle.id);
            }}>Share ID</button>
          )}
          <div className="online-bar" onClick={() => setShowMembersModal(true)} style={{ cursor: 'pointer', transition: 'all 0.2s ease' }} title="View online members">
            <span className="online-dot" />
            <span style={{ fontWeight: 600 }}>{onlineUsers.length} online</span>
          </div>
          {isMember && (
            <>
              <button className="btn-icon" title="Voice call" onClick={() => setShowCallUI(true)}><Phone size={16} /></button>
              <button className="btn-icon" title="Video call" onClick={() => setShowCallUI(true)}><Video size={16} /></button>
            </>
          )}
        </div>
      </div>

      {/* Call UI overlay using Jitsi Meet for instant, working WebRTC calls */}
      {showCallUI && (
        <div className="call-overlay">
          <div className="call-content card-glass fade-in" style={{ width: '90%', maxWidth: '800px', padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--surface-hover)', borderBottom: '1px solid var(--border)' }}>
               <h3 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text)' }}><Video size={16} style={{ color: 'var(--primary)' }} /> Live Circle Room</h3>
               <button className="btn-ghost" style={{ padding: 4 }} onClick={() => setShowCallUI(false)} title="Leave Call"><X size={18} /></button>
            </div>
            <iframe 
              allow="camera; microphone; fullscreen; display-capture; autoplay" 
              src={`https://meet.jit.si/WithMe_App_Circle_${circleId}`} 
              style={{ width: '100%', height: '500px', border: 'none', display: 'block', background: '#000' }}
              title="Jitsi Video Call"
            ></iframe>
          </div>
        </div>
      )}

      {/* Messages / Join Gate */}
      {!isMember ? (
        <div className="cd-messages" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="empty-state card-glass" style={{ padding: '40px', maxWidth: '400px' }}>
            <Users className="empty-icon" />
            <div className="empty-title">You haven't joined this circle</div>
            <div className="empty-desc">Join to see conversations, connect on video calls, and share your thoughts.</div>
            <button className="btn btn-primary" style={{ marginTop: 24, width: '100%' }} onClick={handleJoin}>Join Circle</button>
          </div>
        </div>
      ) : (
        <>
          {showMembersModal && (
            <div className="modal-overlay">
              <div className="modal-content fade-in card-glass">
                <button className="modal-close" onClick={() => setShowMembersModal(false)}><X size={20} /></button>
                <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={20} color="var(--primary)" /> Circle Members
                </h2>
                <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '400px', overflowY: 'auto' }}>
                  {onlineUsers.map(u => (
                    <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--surface-hover)', borderRadius: 'var(--r-md)' }}>
                      <div className="avatar avatar-sm">
                        {u.avatar_url ? <img src={u.avatar_url} alt="" /> : (u.display_name || 'A')[0].toUpperCase()}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text)' }}>{u.display_name || 'Anonymous'}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span className="online-dot" style={{ width: 6, height: 6 }} /> Active now
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="cd-messages">
        {posts.length === 0 ? (
          <div className="empty-state">
            <Users className="empty-icon" />
            <div className="empty-title">Start the conversation</div>
            <div className="empty-desc">This circle is new — be the first to share.</div>
          </div>
        ) : posts.map((item) => {
          const timeAgo = formatDistanceToNow(new Date(item.created_at), { addSuffix: true });
          const { text, file } = parsePost(item.content);
          const avatarUrl = item.author_avatar_url;

          return (
            <div key={item.id} className="msg-card card fade-in">
              <div className="msg-header">
                <div className="avatar avatar-sm">
                  {avatarUrl ? <img src={avatarUrl} alt="" /> : (item.author_name || 'A')[0].toUpperCase()}
                </div>
                <div className="msg-meta">
                  <span className="msg-author">{item.author_name || 'Anonymous'}</span>
                  <span className="msg-time">{timeAgo}</span>
                </div>
              </div>
              {text && <p className="msg-text">{text}</p>}
              {file && (
                <div className="file-attachment" onClick={() => file.url && window.open(file.url, '_blank')}>
                  {React.createElement(getFileIcon(file.type), { size: 18, className: 'file-icon' })}
                  <div className="file-info">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">{formatBytes(file.size)}</span>
                  </div>
                  {file.url && <Download size={14} style={{ color: 'var(--text-tertiary)' }} />}
                </div>
              )}
              <div className="msg-reactions">
                {REACTIONS.map((r) => {
                  const count = (item.post_reactions || []).filter((x) => x.reaction_type === r.id).length;
                  const reacted = (item.post_reactions || []).some((x) => x.reaction_type === r.id && x.user_id === user.id);
                  return (
                    <button key={r.id} className={`reaction-chip${reacted ? ' active' : ''}`} onClick={() => toggleReaction(item.id, r.id)} title={r.label}>
                      <Icon name={r.icon} size={14} />
                      {count > 0 && <span>{count}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <div className="cd-composer">
        {attachment && (
          <div className="composer-attachment">
            {React.createElement(getFileIcon(attachment.type), { size: 16 })}
            <span className="composer-att-name">{attachment.name}</span>
            <button className="composer-att-remove" onClick={() => setAttachment(null)}><X size={14} /></button>
          </div>
        )}
        <form className="cd-composer-row" onSubmit={submitPost}>
          <input type="file" ref={fileInputRef} className="hidden-input" onChange={handleFileSelect} accept="image/*,.pdf,.doc,.docx,.txt" />
          <button type="button" className="btn-icon" onClick={() => fileInputRef.current?.click()} disabled={uploading} title="Attach file">
            <Paperclip size={16} />
          </button>
          <input className="input cd-input" placeholder="Share how you're feeling..." value={newPost} onChange={(e) => setNewPost(e.target.value)} maxLength={500} />
          <button type="submit" className="btn btn-primary btn-sm cd-send" disabled={(!newPost.trim() && !attachment) || posting}>
            {posting ? <span className="spinner" style={{ width: 14, height: 14 }} /> : <Send size={16} />}
          </button>
        </form>
      </div>
        </>
      )}
    </div>
  );
}
