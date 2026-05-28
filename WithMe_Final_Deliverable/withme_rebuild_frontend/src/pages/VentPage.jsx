import React from 'react';
import { Wind } from 'lucide-react';

export default function VentPage() {
  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-2xl)' }}>
        <Wind size={32} style={{ color: 'var(--primary)' }} />
        <h1>Anonymous Venting</h1>
      </div>
      <p>Venting page content coming soon...</p>
    </div>
  );
}
