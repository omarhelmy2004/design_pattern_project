import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function CompanionPage() {
  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-2xl)' }}>
        <MessageCircle size={32} style={{ color: 'var(--primary)' }} />
        <h1>AI Companion</h1>
      </div>
      <p>Companion page content coming soon...</p>
    </div>
  );
}
