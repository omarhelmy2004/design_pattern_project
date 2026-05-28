import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, ShieldAlert, ArrowLeft } from 'lucide-react';
import { chatWithCompanion } from '../lib/groq';
import './CompanionPage.css';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function CompanionPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        setMessages(data.map(m => ({ role: m.role, content: m.content })));
      } else {
        setMessages([
          { role: 'assistant', content: "Hi there. I'm here to listen. Whatever is on your mind, you can share it with me safely here. It's completely private." }
        ]);
      }
      setFetching(false);
    };

    fetchHistory();
  }, [user.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input.trim() };
    const newHistory = [...messages, userMsg];
    
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    // Save user message to DB
    await supabase.from('ai_messages').insert({
      user_id: user.id,
      role: 'user',
      content: userMsg.content
    });

    const reply = await chatWithCompanion(newHistory);
    const assistantMsg = { role: 'assistant', content: reply };
    
    // Save assistant message to DB
    await supabase.from('ai_messages').insert({
      user_id: user.id,
      role: 'assistant',
      content: assistantMsg.content
    });

    setMessages([...newHistory, assistantMsg]);
    setLoading(false);
  };

  return (
    <div className="page-content fade-in cp-page">
      <div className="cp-header">
        <button className="btn-ghost cp-back" onClick={() => navigate(-1)}><ArrowLeft size={18} /></button>
        <div className="cp-title-wrap">
          <div className="cp-icon" style={{ background: 'var(--primary-muted)', color: 'var(--primary)' }}>
            <Sparkles size={18} />
          </div>
          <div>
            <h2>AI Listener</h2>
            <p className="page-header-sub">Private, judgment-free space</p>
          </div>
        </div>
      </div>

      <div className="cp-privacy card-glass">
        <ShieldAlert size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
        <span>This conversation is private and not saved to the community. I'm an AI, here to listen, but not a replacement for professional help.</span>
      </div>

      <div className="cp-chat">
        {fetching ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <div className="spinner" style={{ color: 'var(--primary)' }} />
          </div>
        ) : messages.map((m, i) => (
          <div key={i} className={`cp-msg-row ${m.role === 'user' ? 'cp-msg-right' : 'cp-msg-left'}`}>
            {m.role === 'assistant' && (
              <div className="avatar avatar-sm cp-avatar" style={{ background: 'var(--primary)', color: '#fff' }}>
                <Sparkles size={14} />
              </div>
            )}
            <div className={`cp-bubble ${m.role === 'user' ? 'cp-bubble-user' : 'cp-bubble-ai'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="cp-msg-row cp-msg-left">
            <div className="avatar avatar-sm cp-avatar" style={{ background: 'var(--primary)', color: '#fff' }}>
              <Sparkles size={14} />
            </div>
            <div className="cp-bubble cp-bubble-ai">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="cp-input-area" onSubmit={handleSend}>
        <input 
          className="input cp-input" 
          placeholder="I've been feeling..." 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="btn btn-primary cp-send" disabled={!input.trim() || loading}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
