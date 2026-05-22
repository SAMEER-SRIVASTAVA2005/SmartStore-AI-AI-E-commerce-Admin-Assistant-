import React from 'react';

export default function MetricCard({ title, value, subtitle, icon: Icon, colorClass }) {
  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-gray-700/60 group">
      
      {/* Decorative colored glow on top left corner */}
      <div className={`absolute top-0 left-0 w-1.5 h-full ${colorClass || 'bg-cyan-500'}`}></div>

      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest block">
            {title}
          </span>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">
            {value}
          </h3>
          <span className="text-xs text-gray-400 block font-light">
            {subtitle}
          </span>
        </div>

        {/* Ambient icon wrapper */}
        <div className={`p-3.5 rounded-xl border border-gray-800 transition-all duration-300 group-hover:scale-110`}>
          <Icon className="w-6 h-6 text-gray-400" />
        </div>
      </div>

      {/* Background glow overlay */}
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full pointer-events-none"></div>
    </div>
  );
}
