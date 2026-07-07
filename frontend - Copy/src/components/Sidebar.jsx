import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  LayoutDashboard, 
  History, 
  User as UserIcon, 
  BookMarked, 
  PlusCircle, 
  Users, 
  CreditCard 
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  const isAdmin = user.role === 'admin';

  const linkClass = ({ isActive }) => 
    `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
      isActive 
        ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/20 text-indigo-400 border-l-4 border-indigo-500 shadow-md shadow-indigo-500/5' 
        : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
    }`;

  return (
    <aside className="w-full md:w-64 glass-card p-4 rounded-2xl flex flex-col space-y-2 h-fit md:sticky md:top-24">
      <div className="px-4 py-2 mb-2 border-b border-slate-800/60">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Navigation</p>
      </div>

      {isAdmin ? (
        <>
          <NavLink to="/admin-dashboard" end className={linkClass}>
            <LayoutDashboard className="h-4.5 w-4.5" />
            <span>Overview</span>
          </NavLink>
          <NavLink to="/profile" className={linkClass}>
            <UserIcon className="h-4.5 w-4.5" />
            <span>My Profile</span>
          </NavLink>
        </>
      ) : (
        <>
          <NavLink to="/student-dashboard" end className={linkClass}>
            <LayoutDashboard className="h-4.5 w-4.5" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/profile" className={linkClass}>
            <UserIcon className="h-4.5 w-4.5" />
            <span>My Profile</span>
          </NavLink>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
