import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  History,
  Award,
  ExternalLink,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useJobs } from '../../context/JobContext';

const NAV_ITEMS = [
  {
    to: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    to: '/create',
    label: 'Create Certificates',
    icon: PlusCircle,
  },
  {
    to: '/history',
    label: 'Generation History',
    icon: History,
  },
  {
    to: '/certificates',
    label: 'Certificate Explorer',
    icon: Award,
  },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const { backendStatus } = useJobs();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <NavLink to="/" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-lg text-navy-900 tracking-tight flex items-center gap-1.5">
                CertiGen
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-100 text-brand">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium -mt-0.5">Bulk Generator</p>
            </div>
          </NavLink>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Main Navigation
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-purple-50 text-brand font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer / System Status */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs mb-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-500 font-medium">FastAPI Backend</span>
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                  backendStatus.online ? 'text-emerald-600' : 'text-rose-500'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    backendStatus.online ? 'bg-emerald-500' : 'bg-rose-500'
                  } ${backendStatus.checking ? 'animate-ping' : ''}`}
                />
                {backendStatus.online ? 'Connected' : 'Offline'}
              </span>
            </div>
            <a
              href="http://127.0.0.1:8000/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-slate-500 hover:text-brand flex items-center justify-between font-medium pt-1 border-t border-slate-100 transition-colors"
            >
              <span>Swagger API Docs</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>

          <p className="text-[11px] text-center text-slate-400">
            Powered by FastAPI & ReportLab
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
