import React from 'react';
import { Calendar } from 'lucide-react';

export default function CheckInPage() {
  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-2xl)' }}>
        <Calendar size={32} style={{ color: 'var(--primary)' }} />
        <h1>Daily Check-in</h1>
      </div>
      <p>Check-in page content coming soon...</p>
    </div>
  );
}
