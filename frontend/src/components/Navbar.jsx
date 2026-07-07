import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Library, Menu, X, LogOut, User as UserIcon, BookOpen, LayoutDashboard, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass-panel sticky top-0 z-50 px-6 py-4 shadow-xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="p-2 bg-gradient-to-tr from-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <Library className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent font-display">
            Ved<span className="text-indigo-400 font-medium">Library</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-slate-300 hover:text-white font-medium transition-colors text-sm">
            Home
          </Link>
          
          {user ? (
            <>
              <Link 
                to={user.role === 'admin' ? '/admin-dashboard' : '/student-dashboard'} 
                className="text-slate-300 hover:text-white font-medium transition-colors text-sm flex items-center space-x-1.5"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link 
                to="/profile" 
                className="text-slate-300 hover:text-white font-medium transition-colors text-sm flex items-center space-x-1.5"
              >
                <UserIcon className="h-4 w-4" />
                <span>Profile</span>
              </Link>
              
              <div className="h-4 w-px bg-slate-800"></div>

              <div className="flex items-center space-x-4">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-200">{user.name}</span>
                  <span className="text-[10px] text-indigo-400 capitalize">{user.role}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="glow-btn flex items-center space-x-1.5 bg-slate-900 border border-slate-800 hover:border-red-500/30 hover:bg-red-950/20 text-slate-300 hover:text-red-400 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-slate-300 hover:text-white font-semibold transition-colors text-sm"
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="glow-btn bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all duration-300"
              >
                Get Started
              </Link>
            </>
          )}
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-slate-700 dark:border-slate-700 light:border-slate-300 bg-slate-900/50 dark:bg-slate-900/50 light:bg-white/70 hover:border-indigo-500/50 hover:bg-indigo-950/30 transition-all duration-300 cursor-pointer overflow-hidden group"
          >
            <span
              key={isDark ? 'moon' : 'sun'}
              className="absolute inset-0 flex items-center justify-center animate-theme-spin"
            >
              {isDark
                ? <Moon className="h-4 w-4 text-indigo-300" />
                : <Sun className="h-4 w-4 text-amber-400" />}
            </span>
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center space-x-2">
          {/* Theme Toggle Mobile */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/50 hover:border-indigo-500/50 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <span key={isDark ? 'moon-m' : 'sun-m'} className="absolute inset-0 flex items-center justify-center animate-theme-spin">
              {isDark ? <Moon className="h-4 w-4 text-indigo-300" /> : <Sun className="h-4 w-4 text-amber-400" />}
            </span>
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-400 hover:text-white focus:outline-none cursor-pointer"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-slate-800/60 animate-fade-in">
          <div className="flex flex-col space-y-4 pb-2">
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-white font-medium py-2 text-sm"
            >
              Home
            </Link>
            
            {user ? (
              <>
                <Link 
                  to={user.role === 'admin' ? '/admin-dashboard' : '/student-dashboard'} 
                  onClick={() => setIsOpen(false)}
                  className="text-slate-300 hover:text-white font-medium py-2 text-sm flex items-center space-x-2"
                >
                  <LayoutDashboard className="h-4 w-4 text-indigo-400" />
                  <span>Dashboard</span>
                </Link>
                <Link 
                  to="/profile" 
                  onClick={() => setIsOpen(false)}
                  className="text-slate-300 hover:text-white font-medium py-2 text-sm flex items-center space-x-2"
                >
                  <UserIcon className="h-4 w-4 text-indigo-400" />
                  <span>Profile</span>
                </Link>
                
                <div className="border-t border-slate-800/80 my-2"></div>
                
                <div className="flex items-center space-x-3 py-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{user.name}</p>
                    <p className="text-xs text-indigo-400 capitalize">{user.role}</p>
                  </div>
                </div>

                <button 
                  onClick={() => { setIsOpen(false); handleLogout(); }}
                  className="flex items-center justify-center space-x-2 w-full bg-red-950/20 border border-red-500/30 text-red-400 hover:bg-red-900/30 py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)}
                  className="text-slate-300 hover:text-white font-semibold py-2 text-sm text-center"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  onClick={() => setIsOpen(false)}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3 rounded-xl text-sm font-semibold text-center shadow-lg transition-all duration-300"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
