import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, Plus, RefreshCw, Activity } from 'lucide-react';
import { useJobs } from '../../context/JobContext';

const ROUTE_TITLES = {
  '/': 'Overview Dashboard',
  '/create': 'Generate Certificates',
  '/history': 'Generation History',
  '/certificates': 'Certificate Explorer',
};

export const Navbar = ({ onOpenSidebar }) => {
  const location = useLocation();
  const { loading, fetchJobs, backendStatus } = useJobs();

  const getTitle = () => {
    if (location.pathname.startsWith('/history/')) {
      return 'Job Execution Details';
    }
    return ROUTE_TITLES[location.pathname] || 'CertiGen Portal';
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 text-slate-500 hover:text-navy-900 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-navy-900 tracking-tight leading-tight">
            {getTitle()}
          </h1>
          <p className="text-[11px] text-slate-500 hidden sm:block">
            CertiGen Bulk Certificate Engine
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Backend health badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium">
          <Activity
            className={`w-3.5 h-3.5 ${
              backendStatus.online ? 'text-emerald-500' : 'text-rose-500'
            }`}
          />
          <span className="text-slate-600">API</span>
          <span
            className={`font-semibold ${
              backendStatus.online ? 'text-emerald-700' : 'text-rose-600'
            }`}
          >
            {backendStatus.online ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* Refresh button */}
        <button
          onClick={() => fetchJobs(true)}
          disabled={loading}
          title="Refresh Data"
          className="p-2 text-slate-500 hover:text-navy-900 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand' : ''}`} />
        </button>

        {/* New Job CTA */}
        {location.pathname !== '/create' && (
          <Link
            to="/create"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs sm:text-sm font-semibold shadow-sm transition-all hover:shadow"
          >
            <Plus className="w-4 h-4" />
            <span>New Batch</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
