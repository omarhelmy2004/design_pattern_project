import React from 'react';
import { User } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-2xl)' }}>
        <User size={32} style={{ color: 'var(--primary)' }} />
        <h1>Profile</h1>
      </div>
      <p>Profile page content coming soon...</p>
    </div>
  );
}
