import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  Search,
  Filter,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { useJobs } from '../context/JobContext';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate, formatDateTime, formatRelativeTime } from '../utils/formatters';

export const GenerationHistory = () => {
  const { jobs, loading } = useJobs();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        (job.event_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.job_id || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' || (job.status || '').toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchTerm, statusFilter]);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy-900 tracking-tight">Generation History</h2>
          <p className="text-sm text-slate-500 mt-1">
            Track asynchronous certificate generation batches, status transitions, and recipient logs.
          </p>
        </div>

        <Link
          to="/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs sm:text-sm font-semibold shadow-sm transition-all self-start sm:self-auto"
        >
          <span>Generate New Batch</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
        {/* Search & Filter Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by event name or Job ID..."
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-brand transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-brand"
            >
              <option value="ALL">All Statuses ({jobs.length})</option>
              <option value="completed">Completed</option>
              <option value="completed_with_errors">Completed with Errors</option>
              <option value="processing">Processing</option>
              <option value="queued">Queued</option>
            </select>
          </div>
        </div>

        {/* Loading / Empty / Data Table */}
        {loading && jobs.length === 0 ? (
          <div className="py-16">
            <LoadingSpinner label="Loading generation history from database..." />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={History}
              title={jobs.length === 0 ? 'No Generation Jobs Yet' : 'No Matching Jobs Found'}
              description={
                jobs.length === 0
                  ? 'Submit your first bulk certificate batch to populate this history.'
                  : 'Try adjusting your search criteria or filter to find specific jobs.'
              }
              actionLabel={jobs.length === 0 ? 'Create First Batch' : null}
              actionTo={jobs.length === 0 ? '/create' : null}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">Event Details</th>
                  <th className="py-3 px-6">Event Date</th>
                  <th className="py-3 px-6">Recipients & Progress</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Created</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredJobs.map((job) => {
                  const successRate =
                    job.total_recipients > 0
                      ? Math.round((job.successful_count / job.total_recipients) * 100)
                      : 0;

                  return (
                    <tr key={job.job_id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Event Details */}
                      <td className="py-4 px-6">
                        <Link
                          to={`/history/${job.job_id}`}
                          className="font-semibold text-navy-900 hover:text-brand transition-colors block text-sm"
                        >
                          {job.event_name}
                        </Link>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="font-mono text-[11px] text-slate-400">
                            {job.job_id.slice(0, 8)}...{job.job_id.slice(-4)}
                          </span>
                          <button
                            onClick={() => handleCopy(job.job_id)}
                            title="Copy full Job ID"
                            className="text-slate-400 hover:text-navy-900 p-0.5 rounded transition-colors"
                          >
                            {copiedId === job.job_id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Event Date */}
                      <td className="py-4 px-6 text-slate-600 text-xs">
                        {formatDate(job.completion_date)}
                      </td>

                      {/* Recipients Progress */}
                      <td className="py-4 px-6">
                        <div className="w-44">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-semibold text-slate-800">
                              {job.successful_count} / {job.total_recipients}
                            </span>
                            <span className="text-[11px] font-medium text-slate-500">
                              {successRate}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                            <div
                              style={{ width: `${successRate}%` }}
                              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                            />
                            {job.failed_count > 0 && (
                              <div
                                style={{
                                  width: `${(job.failed_count / job.total_recipients) * 100}%`,
                                }}
                                className="bg-rose-500 h-full rounded-full"
                              />
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-[11px]">
                            <span className="text-emerald-600 font-medium flex items-center gap-0.5">
                              <CheckCircle className="w-3 h-3" />
                              {job.successful_count} success
                            </span>
                            {job.failed_count > 0 && (
                              <span className="text-rose-600 font-medium flex items-center gap-0.5">
                                <AlertCircle className="w-3 h-3" />
                                {job.failed_count} failed
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <StatusBadge status={job.status} size="sm" />
                      </td>

                      {/* Created Time */}
                      <td className="py-4 px-6">
                        <div className="text-xs text-slate-700 flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatRelativeTime(job.created_at)}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {formatDateTime(job.created_at)}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-6 text-right">
                        <Link
                          to={`/history/${job.job_id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-brand bg-purple-50 hover:bg-purple-100 transition-colors shadow-2xs"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
          <span>
            Showing <b>{filteredJobs.length}</b> of <b>{jobs.length}</b> total jobs
          </span>
          <span className="text-slate-400">Data synchronized with backend SQLite</span>
        </div>
      </div>
    </div>
  );
};

export default GenerationHistory;
