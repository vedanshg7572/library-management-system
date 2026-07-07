import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, UserPlus, ShieldAlert, Shield, AlertTriangle } from 'lucide-react';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signup(name, email, password, role, adminCode);
      if (res.success) {
        if (res.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/student-dashboard');
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-76px)] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute bottom-1/3 right-1/2 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-[100px]"></div>

      <div className="glass-card w-full max-w-md p-8 rounded-3xl relative z-10 border border-slate-800">
        
        {/* Form Title */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl mb-3">
            <UserPlus className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-white font-display">Create Account</h2>
          <p className="text-slate-400 text-sm mt-1">Get started with your library portal</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center space-x-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl text-xs font-semibold mb-5 animate-shake">
            <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <User className="h-4.5 w-4.5" />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-950/40 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-200 pl-11 pr-4 py-2.5 rounded-2xl text-sm font-medium outline-none transition-all placeholder:text-slate-650"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Email input */}
          <div className="space-y-1">
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
                className="w-full bg-slate-950/40 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-200 pl-11 pr-4 py-2.5 rounded-2xl text-sm font-medium outline-none transition-all placeholder:text-slate-650"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1">
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
                className="w-full bg-slate-950/40 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-200 pl-11 pr-4 py-2.5 rounded-2xl text-sm font-medium outline-none transition-all placeholder:text-slate-650"
                placeholder="Min 6 characters"
                minLength={6}
              />
            </div>
          </div>

          {/* Role selector Tabs */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Account Type</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-1 rounded-2xl border border-slate-850">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  role === 'student'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  role === 'admin'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Librarian (Admin)
              </button>
            </div>
          </div>

          {/* Admin Secret Code input (conditional, smooth collapse in CSS) */}
          {role === 'admin' && (
            <div className="space-y-1 animate-fade-in border border-indigo-500/10 bg-indigo-500/5 p-4 rounded-2xl">
              <div className="flex items-center space-x-1.5 text-indigo-400 text-xs font-bold mb-1.5 uppercase tracking-wider">
                <ShieldAlert className="h-4.5 w-4.5" />
                <span>Admin Validation</span>
              </div>
              <input
                type="password"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                required={role === 'admin'}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 text-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold outline-none transition-all placeholder:text-slate-650"
                placeholder="Enter Librarian Secret Code"
              />
              <span className="text-[10px] text-slate-500 leading-normal block pt-1 font-semibold">
                Use <code className="bg-slate-900 text-indigo-300 font-bold px-1 rounded">LIBRARIAN2026</code> for testing.
              </span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full glow-btn bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-2xl text-sm shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer mt-4"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Register Account</span>
                <UserPlus className="h-4.5 w-4.5" />
              </>
            )}
          </button>
        </form>

        {/* Redirect Link */}
        <p className="text-center text-xs text-slate-500 mt-5 font-semibold">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 hover:underline">
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;
