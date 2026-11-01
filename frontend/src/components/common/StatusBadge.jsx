import React from 'react';
import { getStatusMeta } from '../../utils/formatters';

export const StatusBadge = ({ status, size = 'md', className = '' }) => {
  const meta = getStatusMeta(status);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
    lg: 'px-3 py-1.5 text-sm font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${meta.bg} ${meta.text} ${meta.border} ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${meta.dot} ${
          meta.animate ? 'animate-pulse' : ''
        }`}
      />
      {meta.label}
    </span>
  );
};

export default StatusBadge;
