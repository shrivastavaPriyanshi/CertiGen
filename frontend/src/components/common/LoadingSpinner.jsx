import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ label = 'Loading...', size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center py-10 gap-3 text-slate-500 ${className}`}>
      <Loader2 className={`${sizeMap[size] || sizeMap.md} animate-spin text-brand`} />
      {label && <p className="text-xs font-medium tracking-wide text-slate-500">{label}</p>}
    </div>
  );
};

export default LoadingSpinner;
