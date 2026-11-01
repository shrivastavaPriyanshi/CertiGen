import React from 'react';
import { Award, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon: Icon = Award,
  title = 'No items found',
  description = 'There are no records to display at this time.',
  actionLabel,
  actionTo,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl border border-dashed border-slate-200">
      <div className="w-14 h-14 rounded-2xl bg-purple-50 text-brand flex items-center justify-center mb-4 shadow-sm border border-purple-100">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-navy-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>

      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand text-white text-sm font-medium hover:bg-brand-hover shadow-sm transition-all"
        >
          {actionLabel}
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}

      {actionLabel && onAction && !actionTo && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand text-white text-sm font-medium hover:bg-brand-hover shadow-sm transition-all"
        >
          {actionLabel}
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default EmptyState;
