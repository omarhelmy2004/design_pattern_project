import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { STRUGGLES } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/Icon';
import './CirclesPage.css';

const getStruggle = (id) => STRUGGLES.find((s) => s.id === id) || {};

export default function CirclesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [circles, setCircles] = useState([]);
  const [myCircles, setMyCircles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('discover');
  const [search, setSearch] = useState('');

  const fetchCircles = useCallback(async () => {
    const { data: allCircles } = await supabase.from('circles').select('*, circle_members(count)').or('is_private.eq.false,is_private.is.null').order('created_at', { ascending: false });
    const { data: memberships } = await supabase.from('circle_members').select('circle_id').eq('user_id', user.id);
    const myIds = [...new Set((memberships || []).map((m) => m.circle_id))];
    setMyCircles(myIds);
    const uniqueCircles = Array.from(new Map((allCircles || []).map((c) => [c.id, c])).values());
    setCircles(uniqueCircles);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchCircles(); }, [fetchCircles]);

  const goToCircle = (circleId) => {
    navigate(`/circles/${circleId}`);
  };

  let displayed = tab === 'mine' ? circles.filter((c) => myCircles.includes(c.id)) : circles;
  if (search.trim()) displayed = displayed.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  const [showPrivateModal, setShowPrivateModal] = useState(false);
  const [joinId, setJoinId] = useState('');
  const [joinError, setJoinError] = useState('');
  const [createName, setCreateName] = useState('');
  const [createDesc, setCreateDesc] = useState('');
  const [creating, setCreating] = useState(false);

  const handleJoinPrivate = async () => {
    if (!joinId.trim()) return;
    const { data, error } = await supabase.from('circles').select('id').eq('id', joinId.trim()).single();
    if (error || !data) { setJoinError('Circle not found or invalid ID.'); return; }
    navigate(`/circles/${data.id}`);
  };

  const handleCreatePrivate = async () => {
    if (!createName.trim()) return;
    setCreating(true);
    const { data, error } = await supabase.from('circles').insert({
      name: createName.trim(), description: createDesc.trim(), is_private: true, created_by: user.id
    }).select().single();
    if (!error && data) {
      navigate(`/circles/${data.id}`);
    }
    setCreating(false);
  };

  return (
    <div className="page-content fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Circles</h2>
          <p className="page-header-sub">Safe spaces organized by what you're going through</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => setShowPrivateModal(true)}>
          Private Circle
        </button>
      </div>

      <div className="circles-toolbar">
        <div className="circles-tabs">
          <button className={`tab-btn${tab === 'discover' ? ' active' : ''}`} onClick={() => setTab('discover')}>Discover</button>
          <button className={`tab-btn${tab === 'mine' ? ' active' : ''}`} onClick={() => setTab('mine')}>
            My circles{myCircles.length > 0 ? ` (${myCircles.length})` : ''}
          </button>
        </div>
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input className="search-input" placeholder="Search circles..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
          <div className="spinner" style={{ color: 'var(--primary)', width: 28, height: 28 }} />
        </div>
      ) : displayed.length === 0 ? (
        <div className="empty-state">
          <Users className="empty-icon" />
          <div className="empty-title">{tab === 'mine' ? 'No circles joined yet' : 'No circles found'}</div>
          <div className="empty-desc">{tab === 'mine' ? 'Explore Discover to find and join circles.' : 'Try a different search term.'}</div>
        </div>
      ) : (
        <div className="circles-list">
          {displayed.map((c) => {
            const s = getStruggle(c.struggle_type);
            const isMember = myCircles.includes(c.id);
            const count = c.circle_members?.[0]?.count || 0;

            return (
              <button key={c.id} className="circle-row card card-hover" onClick={() => goToCircle(c.id)}>
                <div className="circle-row-icon" style={{ background: (s.color || 'var(--primary)') + '18', color: s.color || 'var(--primary)' }}>
                  {s.icon ? <Icon name={s.icon} size={20} /> : <Users size={20} />}
                </div>
                <div className="circle-row-body">
                  <div className="circle-row-top">
                    <span className="circle-row-name">{c.name}</span>
                    {isMember && <span className="badge badge-accent">Joined</span>}
                  </div>
                  <p className="circle-row-desc">{c.description}</p>
                  <div className="circle-row-meta">
                    <span className="circle-row-members"><Users size={13} /> {count} members</span>
                    {s.label && (
                      <span className="circle-row-tag" style={{ background: (s.color || 'var(--primary)') + '18', color: s.color || 'var(--primary)' }}>
                        {s.label}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Private Circle Modal */}
      {showPrivateModal && (
        <div className="modal-overlay" onClick={() => setShowPrivateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <button className="btn-ghost" onClick={() => setShowPrivateModal(false)}>Cancel</button>
              <h3>Private Circles</h3>
              <div style={{ width: 40 }} />
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div className="card-glass" style={{ padding: '16px' }}>
                <h4 style={{ marginBottom: '8px', fontSize: '1rem' }}>Join Private Circle</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Enter the unique ID shared by the creator.</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input className="input" style={{ flex: 1 }} placeholder="Paste ID here" value={joinId} onChange={e => {setJoinId(e.target.value); setJoinError('')}} />
                  <button className="btn btn-primary" onClick={handleJoinPrivate}>Join</button>
                </div>
                {joinError && <div style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '8px' }}>{joinError}</div>}
              </div>

              <div className="card-glass" style={{ padding: '16px' }}>
                <h4 style={{ marginBottom: '8px', fontSize: '1rem' }}>Create Private Circle</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Create an unlisted circle only accessible via link/ID.</p>
                <input className="input" style={{ marginBottom: '12px', width: '100%' }} placeholder="Circle Name" value={createName} onChange={e => setCreateName(e.target.value)} />
                <textarea className="input" style={{ minHeight: '60px', width: '100%', marginBottom: '12px' }} placeholder="Description (Optional)" value={createDesc} onChange={e => setCreateDesc(e.target.value)} />
                <button className="btn btn-secondary" style={{ width: '100%' }} disabled={!createName.trim() || creating} onClick={handleCreatePrivate}>
                  {creating ? 'Creating...' : 'Create & Get ID'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
