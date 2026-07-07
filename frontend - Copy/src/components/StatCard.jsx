import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'indigo' }) => {
  const gradients = {
    indigo: 'from-indigo-600/20 to-purple-600/10 border-indigo-500/20 text-indigo-400',
    emerald: 'from-emerald-600/20 to-teal-600/10 border-emerald-500/20 text-emerald-400',
    amber: 'from-amber-600/20 to-orange-600/10 border-amber-500/20 text-amber-400',
    rose: 'from-rose-600/20 to-red-600/10 border-rose-500/20 text-rose-400',
    violet: 'from-violet-600/20 to-fuchsia-600/10 border-violet-500/20 text-violet-400'
  };

  const iconBgs = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20'
  };

  return (
    <div className={`glass-card p-6 rounded-2xl border bg-gradient-to-br ${gradients[color]} flex items-center justify-between shadow-lg`}>
      <div className="space-y-2">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-bold text-white tracking-tight font-display">{value}</h3>
      </div>
      <div className={`p-4 rounded-xl border ${iconBgs[color]} shadow-md`}>
        {Icon && <Icon className="h-6 w-6" />}
      </div>
    </div>
  );
};

export default StatCard;
