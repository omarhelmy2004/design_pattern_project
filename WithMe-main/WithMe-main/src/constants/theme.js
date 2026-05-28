// WithMe — Premium Theme Constants

export const COLORS = {
  // Primary indigo gradient
  primary: '#6366F1',
  primaryHover: '#4F46E5',
  primaryMuted: 'rgba(99, 102, 241, 0.12)',
  primaryGlow: 'rgba(99, 102, 241, 0.25)',

  // Accent teal
  accent: '#14B8A6',
  accentMuted: 'rgba(20, 184, 166, 0.12)',

  // Surfaces
  bg: '#0F0F14',
  bgElevated: '#16161E',
  surface: '#1C1C27',
  surfaceHover: '#232333',
  surfaceBright: '#2A2A3D',

  // Text
  text: '#F0F0F5',
  textSecondary: '#9CA3AF',
  textTertiary: '#6B7280',
  textInverse: '#0F0F14',

  // Borders
  border: '#2D2D3D',
  borderLight: '#3D3D50',

  // Semantic
  danger: '#EF4444',
  dangerMuted: 'rgba(239, 68, 68, 0.12)',
  warning: '#F59E0B',
  warningMuted: 'rgba(245, 158, 11, 0.12)',
  success: '#10B981',
  successMuted: 'rgba(16, 185, 129, 0.12)',

  // Online status
  online: '#22C55E',
  away: '#F59E0B',
  offline: '#6B7280',
};

export const STRUGGLES = [
  { id: 'anxiety',       label: 'Anxiety',          icon: 'Waves',        color: '#818CF8', desc: 'Worry, panic, overthinking' },
  { id: 'grief',         label: 'Grief & Loss',     icon: 'Heart',        color: '#14B8A6', desc: 'Losing someone or something' },
  { id: 'burnout',       label: 'Burnout',          icon: 'Flame',        color: '#F59E0B', desc: 'Exhausted, empty, overwhelmed' },
  { id: 'loneliness',    label: 'Loneliness',       icon: 'Moon',         color: '#EF4444', desc: 'Disconnected, isolated' },
  { id: 'depression',    label: 'Low Mood',         icon: 'Cloud',        color: '#9CA3AF', desc: 'Feeling down, hopeless' },
  { id: 'relationships', label: 'Relationships',    icon: 'HeartCrack',   color: '#F472B6', desc: 'Breakups, conflicts, trust' },
  { id: 'health',        label: 'Health Stress',    icon: 'Activity',     color: '#3B82F6', desc: 'Illness, medical worries' },
  { id: 'life_change',   label: 'Big Life Change',  icon: 'RefreshCw',    color: '#A78BFA', desc: 'Moving, job loss, transitions' },
];

export const REACTIONS = [
  { id: 'hear_you',  icon: 'Heart',      label: 'I hear you' },
  { id: 'same',      icon: 'HandMetal',  label: 'Same' },
  { id: 'strength',  icon: 'Zap',        label: 'Strength' },
  { id: 'hug',       icon: 'Hand',       label: 'Warmth' },
];

export const MOODS = [
  { score: 1, icon: 'Frown',    label: 'Really rough',  color: '#EF4444' },
  { score: 2, icon: 'Meh',      label: 'Struggling',    color: '#F59E0B' },
  { score: 3, icon: 'Minus',    label: 'Getting by',    color: '#9CA3AF' },
  { score: 4, icon: 'Smile',    label: 'Okay',          color: '#14B8A6' },
  { score: 5, icon: 'SmilePlus',label: 'Pretty good',   color: '#22C55E' },
];
