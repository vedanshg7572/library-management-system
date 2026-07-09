import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AnimatedDock } from './animated-dock';
import {
  Home, BookOpen, User, GitBranch, LayoutDashboard,
  LogIn, LogOut, ShieldCheck
} from 'lucide-react';


/* ── Floating dock — visible on all pages ─────────────────── */
const FloatingDock = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Hide on reader page (full-screen reading experience)
  if (location.pathname.startsWith('/read/')) return null;

  const isActive = (path) => location.pathname === path;

  // Build items based on auth state
  const items = [
    {
      label: 'Home',
      link: '/',
      Icon: <Home size={18} />,
      active: isActive('/'),
    },
    ...(user
      ? [
          {
            label: user.role === 'admin' ? 'Admin Panel' : 'My Library',
            link: user.role === 'admin' ? '/admin-dashboard' : '/student-dashboard',
            Icon: user.role === 'admin'
              ? <ShieldCheck size={18} />
              : <BookOpen size={18} />,
            active: isActive('/student-dashboard') || isActive('/admin-dashboard'),
          },
          {
            label: 'Profile',
            link: '/profile',
            Icon: <User size={18} />,
            active: isActive('/profile'),
          },
        ]
      : [
          {
            label: 'Sign In',
            link: '/login',
            Icon: <LogIn size={18} />,
            active: isActive('/login'),
          },
        ]),

    // GitHub — always visible (Vedansh's profile)
    {
      label: 'GitHub @vedanshg7572',
      link: 'https://github.com/vedanshg7572',
      target: '_blank',
      Icon: <GitBranch size={18} />,
      active: false,
    },


    // Logout — only when logged in
    ...(user
      ? [
          {
            label: 'Logout',
            link: '/',
            Icon: <LogOut size={18} />,
            active: false,
            onClick: logout,
          },
        ]
      : []),
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <AnimatedDock items={items} />
    </div>
  );
};

export default FloatingDock;
