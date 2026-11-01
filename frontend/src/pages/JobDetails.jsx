import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  FileCheck,
  RefreshCw,
} from 'lucide-react';
import api, { getErrorMessage } from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import StatCard from '../components/common/StatCard';
import RecipientTable from '../components/certificates/RecipientTable';
import CertificatePreviewModal from '../components/certificates/CertificatePreviewModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate } from '../utils/formatters';

export const JobDetails = () => {
  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Selected recipient for preview modal
  const [previewRecipient, setPreviewRecipient] = useState(null);

  const fetchJob = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const data = await api.getJobStatus(jobId);
      setJob(data);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      if (!quiet) setLoading(false);
    }
  }, [jobId]);

  // Initial fetch and automatic polling for active jobs
  useEffect(() => {
    fetchJob();

    let interval = null;
    interval = setInterval(() => {
      // Check if job is still queued or processing
      setJob((currentJob) => {
        if (currentJob && (currentJob.status === 'queued' || currentJob.status === 'processing')) {
          fetchJob(true);
        }
        return currentJob;
      });
    }, 2000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchJob]);

  const handleCopyId = () => {
    if (!jobId) return;
    navigator.clipboard.writeText(jobId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading && !job) {
    return (
      <div className="py-24">
        <LoadingSpinner label="Fetching job execution details..." size="lg" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-navy-900">Job Not Found</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          {error || `Unable to locate a generation job with ID: ${jobId}`}
        </p>
        <Link
          to="/history"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand text-white text-xs font-semibold hover:bg-brand-hover shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to History</span>
        </Link>
      </div>
    );
  }

  const successPercent =
    job.total_recipients > 0
      ? Math.round((job.successful_count / job.total_recipients) * 100)
      : 0;

  const isProcessing = job.status === 'queued' || job.status === 'processing';

  return (
    <div className="space-y-6">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/history"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Generation History</span>
        </Link>

        <button
          onClick={() => fetchJob(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Status</span>
        </button>
      </div>

      {/* Main Job Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-extrabold text-navy-900 tracking-tight">
                {job.event_name}
              </h2>
              <StatusBadge status={job.status} size="md" />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Completion Date: <b>{formatDate(job.completion_date)}</b>
              </span>

              <span>•</span>

              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-slate-400">Job ID:</span>
                <span className="font-semibold text-slate-700">{job.job_id}</span>
                <button
                  onClick={handleCopyId}
                  title="Copy full Job ID"
                  className="text-slate-400 hover:text-navy-900 p-0.5 rounded transition-colors"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {isProcessing && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-brand text-xs font-semibold self-start md:self-auto">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing in Background...</span>
            </div>
          )}
        </div>

        {/* Batch Progress Overview */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
            <span>Overall Batch Completion</span>
            <span>{successPercent}% Completed</span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${successPercent}%` }}
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

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <StatCard
            title="Total In Batch"
            value={job.total_recipients}
            subtitle="Recipients requested"
            icon={FileCheck}
            color="purple"
          />
          <StatCard
            title="Successful"
            value={job.successful_count}
            subtitle="PDFs generated"
            icon={CheckCircle2}
            color="emerald"
          />
          <StatCard
            title="Failed"
            value={job.failed_count}
            subtitle="Validation / errors"
            icon={AlertTriangle}
            color="rose"
          />
          <StatCard
            title="Pending"
            value={job.pending_count}
            subtitle="In processing pipeline"
            icon={Clock}
            color="amber"
          />
        </div>
      </div>

      {/* Recipient Certificates Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-navy-900">Recipient Execution Logs</h3>
          <span className="text-xs text-slate-500">
            Total Records: <b>{job.recipients?.length || 0}</b>
          </span>
        </div>

        <RecipientTable
          recipients={job.recipients || []}
          onPreview={(recipient) => setPreviewRecipient(recipient)}
        />
      </div>

      {/* Certificate In-Browser PDF Preview Modal */}
      <CertificatePreviewModal
        isOpen={Boolean(previewRecipient)}
        onClose={() => setPreviewRecipient(null)}
        recipient={previewRecipient}
      />
    </div>
  );
};

export default JobDetails;
