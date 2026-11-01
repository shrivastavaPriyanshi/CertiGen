import React from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Award,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useJobs } from '../context/JobContext';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import { formatDate, formatRelativeTime } from '../utils/formatters';

export const Dashboard = () => {
  const { jobs, stats, loading } = useJobs();

  // 5 most recent jobs
  const recentJobs = jobs.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy-900 via-indigo-950 to-purple-950 text-white p-6 sm:p-8 lg:p-10 shadow-elevated">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-purple-200 text-xs font-medium mb-4 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>High-Throughput Certificate Automation</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Automate & Dispatch Certificates at Scale
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Generate customized, print-ready PDF certificates for bootcamps, workshops, and courses.
            Track asynchronous batch jobs in real time.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold shadow-lg shadow-purple-600/30 transition-all hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Generation Job</span>
            </Link>

            <Link
              to="/history"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold backdrop-blur-md transition-colors border border-white/10"
            >
              <span>View History</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Generation Jobs"
          value={stats.totalJobs}
          subtitle="Processed batches"
          icon={Briefcase}
          color="purple"
          loading={loading}
        />
        <StatCard
          title="Certificates Generated"
          value={stats.totalCertificates}
          subtitle="Total recipient records"
          icon={Award}
          color="blue"
          loading={loading}
        />
        <StatCard
          title="Successful Certificates"
          value={stats.successfulCertificates}
          subtitle={`${
            stats.totalCertificates > 0
              ? Math.round((stats.successfulCertificates / stats.totalCertificates) * 100)
              : 100
          }% success rate`}
          icon={CheckCircle2}
          color="emerald"
          loading={loading}
        />
        <StatCard
          title="Failed Certificates"
          value={stats.failedCertificates}
          subtitle="Validation / generation errors"
          icon={AlertTriangle}
          color="rose"
          loading={loading}
        />
      </div>

      {/* Recent Generation Activity */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-navy-900">Recent Generation Jobs</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status and summary of recently submitted batches
            </p>
          </div>

          <Link
            to="/history"
            className="text-xs font-semibold text-brand hover:text-brand-hover flex items-center gap-1 transition-colors"
          >
            <span>See all jobs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentJobs.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Briefcase}
              title="No Jobs Submitted Yet"
              description="Get started by creating your first bulk certificate generation batch."
              actionLabel="Create First Batch"
              actionTo="/create"
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">Event Name</th>
                  <th className="py-3 px-6">Event Date</th>
                  <th className="py-3 px-6">Recipients Progress</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Created</th>
                  <th className="py-3 px-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentJobs.map((job) => {
                  const successRate =
                    job.total_recipients > 0
                      ? Math.round((job.successful_count / job.total_recipients) * 100)
                      : 0;

                  return (
                    <tr key={job.job_id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <Link
                          to={`/history/${job.job_id}`}
                          className="font-semibold text-navy-900 hover:text-brand transition-colors block"
                        >
                          {job.event_name}
                        </Link>
                        <span className="font-mono text-[11px] text-slate-400">
                          ID: {job.job_id.slice(0, 12)}...
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-600 text-xs">
                        {formatDate(job.completion_date)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="w-40">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-semibold text-slate-700">
                              {job.successful_count} / {job.total_recipients}
                            </span>
                            <span className="text-[11px] text-slate-400">{successRate}%</span>
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
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={job.status} size="sm" />
                      </td>
                      <td className="py-4 px-6 text-slate-500 text-xs flex items-center gap-1.5 mt-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {formatRelativeTime(job.created_at)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          to={`/history/${job.job_id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand bg-purple-50 hover:bg-purple-100 transition-colors"
                        >
                          <span>Inspect</span>
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
      </div>
    </div>
  );
};

export default Dashboard;
