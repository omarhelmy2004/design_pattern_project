import React, { useState, useEffect } from 'react';
import { Users, Plus } from 'lucide-react';

const TOPICS = [
  { id: 'anxiety', label: 'Anxiety', color: '#818CF8' },
  { id: 'grief', label: 'Grief & Loss', color: '#14B8A6' },
  { id: 'burnout', label: 'Burnout', color: '#F59E0B' },
  { id: 'loneliness', label: 'Loneliness', color: '#EF4444' },
  { id: 'depression', label: 'Low Mood', color: '#9CA3AF' },
  { id: 'relationships', label: 'Relationships', color: '#F472B6' },
];

export default function CirclesPage() {
  const [circles, setCircles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading circles
    setTimeout(() => {
      setCircles(TOPICS.map(topic => ({
        id: topic.id,
        name: topic.label,
        description: `Connect with others experiencing ${topic.label}`,
        topic: topic.id,
        memberCount: Math.floor(Math.random() * 500) + 50,
        isPublic: true,
        color: topic.color
      })));
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div style={{
        padding: 'var(--spacing-lg)',
        textAlign: 'center'
      }}>
        <p>Loading circles...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--spacing-2xl)'
      }}>
        <h1>Support Circles</h1>
        <button className="btn-primary" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-sm)',
          padding: 'var(--spacing-md) var(--spacing-lg)'
        }}>
          <Plus size={20} />
          New Circle
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 'var(--spacing-lg)'
      }}>
        {circles.map(circle => (
          <div
            key={circle.id}
            className="card"
            style={{
              borderLeft: `4px solid ${circle.color}`,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-md)'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: circle.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0
              }}>
                <Users size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: 'var(--spacing-xs)' }}>{circle.name}</h3>
                <p style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--text)',
                  margin: 0
                }}>
                  {circle.memberCount} members
                </p>
              </div>
            </div>
            <p style={{
              fontSize: 'var(--font-size-sm)',
              marginBottom: 'var(--spacing-md)',
              color: 'var(--text)'
            }}>
              {circle.description}
            </p>
            <button className="btn-outline" style={{
              width: '100%',
              padding: 'var(--spacing-sm)',
              fontSize: 'var(--font-size-sm)'
            }}>
              Join Circle
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
