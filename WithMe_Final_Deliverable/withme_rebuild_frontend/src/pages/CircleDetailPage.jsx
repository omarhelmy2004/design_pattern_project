import React from 'react';
import { useParams } from 'react-router-dom';

export default function CircleDetailPage() {
  const { circleId } = useParams();

  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      <h1>Circle Details</h1>
      <p>Circle ID: {circleId}</p>
      <p>Circle detail page content coming soon...</p>
    </div>
  );
}
