import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme, THEMES } from '../context/ThemeContext';
import { Heart, Users, Calendar, Wind, MessageCircle, User, Sun, Moon, LogOut } from 'lucide-react';
import { generateAvatarDataURL } from '../utils/avatarGenerator';

export default function Layout() {
  const { user, logout } = useAuth();
  const { theme, setTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleTheme = () => {
    const isForest = theme.includes('forest');
    const newTheme = isDark 
      ? (isForest ? THEMES.FOREST_LIGHT : THEMES.SAGE_LIGHT)
      : (isForest ? THEMES.FOREST_DARK : THEMES.SAGE_DARK);
    setTheme(newTheme);
  };

  const navItems = [
    { icon: Users, label: 'Circles', path: '/circles' },
    { icon: Wind, label: 'Vent', path: '/vent' },
    { icon: Calendar, label: 'Check-in', path: '/checkin' },
    { icon: MessageCircle, label: 'Companion', path: '/companion' },
    { icon: User, label: 'Profile', path: '/profile' }
  ];

  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <nav style={{
        width: '250px',
        backgroundColor: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        padding: 'var(--spacing-lg)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Logo */}
        <div className="flex flex-center gap-md" style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <Heart size={28} style={{ color: 'var(--primary)' }} />
          <h1 style={{ fontSize: 'var(--font-size-xl)', margin: 0 }}>WithMe</h1>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col gap-md" style={{ flex: 1 }}>
          {navItems.map(({ icon: Icon, label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex gap-md"
              style={{
                background: 'transparent',
                color: 'var(--text)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: 'var(--font-size-base)',
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--primary)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* User Profile & Settings */}
        <div className="flex flex-col gap-md" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--spacing-lg)' }}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex gap-md"
            style={{
              background: 'transparent',
              color: 'var(--text)',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              fontSize: 'var(--font-size-base)',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            <span>{isDark ? 'Light' : 'Dark'}</span>
          </button>

          {/* User Info */}
          <div className="flex gap-md" style={{ alignItems: 'center' }}>
            <img
              src={generateAvatarDataURL(user?.avatarSeed || 'default', 40)}
              alt="Avatar"
              style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)' }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
                {user?.displayName || 'Anonymous'}
              </p>
              <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', color: 'var(--text)' }}>
                {user?.anonymousId?.substring(0, 8)}...
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex gap-md"
            style={{
              background: 'transparent',
              color: 'var(--danger)',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              fontSize: 'var(--font-size-base)',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
