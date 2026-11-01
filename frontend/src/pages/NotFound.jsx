import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-purple-50 text-brand flex items-center justify-center font-bold text-2xl mb-4 border border-purple-100">
        404
      </div>
      <h2 className="text-2xl font-bold text-navy-900 tracking-tight">Page Not Found</h2>
      <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-semibold shadow-sm transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};

export default NotFound;
