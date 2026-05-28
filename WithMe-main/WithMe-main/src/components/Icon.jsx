import React from 'react';
import * as LucideIcons from 'lucide-react';

// Dynamic icon component — pass a Lucide icon name as string
export default function Icon({ name, size = 20, className = '', ...props }) {
  const LucideIcon = LucideIcons[name];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} className={className} strokeWidth={1.8} {...props} />;
}
