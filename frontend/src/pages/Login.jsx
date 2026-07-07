import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertTriangle, Key } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        if (res.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/student-dashboard');
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to fill demo credentials
  const fillDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@library.com');
      setPassword('password123');
    } else {
      setEmail('student@library.com');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-[calc(100vh-76px)] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-[100px]"></div>

      <div className="glass-card w-full max-w-md p-8 rounded-3xl relative z-10 border border-slate-800 animate-page-enter glow-border">
        
        {/* Form Title */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl mb-4">
            <LogIn className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-white font-display">Welcome Back</h2>
          <p className="text-slate-400 text-sm mt-1.5">Sign in to manage your books and checkouts</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center space-x-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl text-xs font-semibold mb-6 animate-shake">
            <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <Mail className="h-4.5 w-4.5" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-glow w-full bg-slate-950/40 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-200 pl-11 pr-4 py-3 rounded-2xl text-sm font-medium outline-none transition-all placeholder:text-slate-600"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <Lock className="h-4.5 w-4.5" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-glow w-full bg-slate-950/40 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-200 pl-11 pr-4 py-3 rounded-2xl text-sm font-medium outline-none transition-all placeholder:text-slate-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full glow-btn btn-zoom ripple-btn bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-2xl text-sm shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Sign In</span>
                <LogIn className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Redirect Link */}
        <p className="text-center text-xs text-slate-500 mt-6 font-semibold">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 hover:underline">
            Register here
          </Link>
        </p>

        {/* Demo Credentials Panel */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold mb-3 uppercase tracking-wider">
            <Key className="h-3.5 w-3.5" />
            <span>Quick Demo Credentials</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => fillDemo('student')}
              className="btn-zoom ripple-btn bg-slate-900/60 border border-slate-850 hover:bg-slate-800/50 hover:border-slate-800 text-slate-300 py-2.5 px-3 rounded-xl text-left text-[11px] font-semibold transition-all cursor-pointer"
            >
              <p className="text-white font-bold">John Doe (Student)</p>
              <p className="text-slate-500 mt-0.5">student@library.com</p>
            </button>
            <button
              onClick={() => fillDemo('admin')}
              className="btn-zoom ripple-btn bg-slate-900/60 border border-slate-850 hover:bg-slate-800/50 hover:border-slate-800 text-slate-300 py-2.5 px-3 rounded-xl text-left text-[11px] font-semibold transition-all cursor-pointer"
            >
              <p className="text-white font-bold">Librarian (Admin)</p>
              <p className="text-slate-500 mt-0.5">admin@library.com</p>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
