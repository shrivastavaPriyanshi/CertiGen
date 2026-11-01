import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'purple', loading = false }) => {
  const colorStyles = {
    purple: {
      bg: 'bg-purple-50',
      text: 'text-brand',
      border: 'border-purple-100',
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-100',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-100',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
    },
  };

  const currentStyle = colorStyles[color] || colorStyles.purple;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle hover:shadow-card transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            {title}
          </p>
          {loading ? (
            <div className="h-8 w-20 bg-slate-100 animate-pulse rounded my-1" />
          ) : (
            <h3 className="text-2xl lg:text-3xl font-bold text-navy-900 tracking-tight">
              {value}
            </h3>
          )}
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${currentStyle.bg} ${currentStyle.text} border ${currentStyle.border}`}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
