import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  Search,
  Filter,
  Download,
  Eye,
  FileCheck,
  AlertCircle,
  Briefcase,
  Layers,
} from 'lucide-react';
import { useJobs } from '../context/JobContext';
import api, { getErrorMessage } from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CertificatePreviewModal from '../components/certificates/CertificatePreviewModal';

export const CertificateManagement = () => {
  const { jobs } = useJobs();

  const [selectedJobId, setSelectedJobId] = useState('ALL');
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('completed'); // Default to completed certificates
  const [previewRecipient, setPreviewRecipient] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  // Fetch recipients across selected job or all jobs
  useEffect(() => {
    let isMounted = true;
    const loadRecipients = async () => {
      setLoading(true);
      setError(null);

      try {
        if (selectedJobId !== 'ALL') {
          const data = await api.getJobCertificates(selectedJobId);
          if (isMounted) {
            setRecipients(
              (data || []).map((r) => {
                const matchedJob = jobs.find((j) => j.job_id === selectedJobId);
                return {
                  ...r,
                  eventName: matchedJob?.event_name || 'Certificate Event',
                };
              })
            );
          }
        } else {
          // Fetch recipients from all jobs in parallel
          const jobsToFetch = jobs.slice(0, 10); // recent 10 jobs
          const results = await Promise.allSettled(
            jobsToFetch.map(async (job) => {
              const items = await api.getJobCertificates(job.job_id);
              return (items || []).map((item) => ({
                ...item,
                eventName: job.event_name,
                jobId: job.job_id,
              }));
            })
          );

          if (isMounted) {
            const aggregated = [];
            results.forEach((res) => {
              if (res.status === 'fulfilled' && Array.isArray(res.value)) {
                aggregated.push(...res.value);
              }
            });
            setRecipients(aggregated);
          }
        }
      } catch (err) {
        if (isMounted) setError(getErrorMessage(err));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (jobs.length > 0) {
      loadRecipients();
    } else {
      setRecipients([]);
    }

    return () => {
      isMounted = false;
    };
  }, [selectedJobId, jobs]);

  // Filter recipients based on search and status
  const filteredRecipients = useMemo(() => {
    return recipients.filter((r) => {
      const matchesSearch =
        (r.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.eventName || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' || (r.status || '').toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [recipients, searchTerm, statusFilter]);

  const handleDownload = async (recipient) => {
    try {
      setDownloadingId(recipient.id);
      const blob = await api.downloadCertificateBlob(recipient.id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate_${recipient.name.replace(/\s+/g, '_')}_${recipient.id.slice(0, 8)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-navy-900 tracking-tight">
          Certificate Explorer & Downloads
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Inspect, preview, and download individual PDF certificates across all generation jobs.
        </p>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
        {/* Controls Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search recipient or event..."
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-brand transition-all"
            />
          </div>

          {/* Job & Status Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Job selector */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-medium text-slate-700 focus:outline-none max-w-[180px] truncate"
              >
                <option value="ALL">All Generation Batches</option>
                {jobs.map((j) => (
                  <option key={j.job_id} value={j.job_id}>
                    {j.event_name} ({j.total_recipients})
                  </option>
                ))}
              </select>
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-medium text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="completed">Completed (Ready to Download)</option>
                <option value="failed">Failed / Invalid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Table */}
        {loading ? (
          <div className="py-20">
            <LoadingSpinner label="Fetching certificates from backend..." />
          </div>
        ) : filteredRecipients.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Award}
              title="No Certificates Found"
              description="No certificate records match your selected batch or search filters."
              actionLabel={jobs.length === 0 ? 'Create Generation Batch' : null}
              actionTo={jobs.length === 0 ? '/create' : null}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">Recipient Name</th>
                  <th className="py-3 px-6">Email Address</th>
                  <th className="py-3 px-6">Event Context</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecipients.map((recipient) => {
                  const isCompleted = recipient.status === 'completed';

                  return (
                    <tr key={recipient.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-6 font-semibold text-navy-900">
                        {recipient.name || <span className="text-slate-400 italic">No name</span>}
                      </td>
                      <td className="py-3.5 px-6 font-mono text-xs text-slate-600">
                        {recipient.email}
                      </td>
                      <td className="py-3.5 px-6 text-xs text-slate-700 font-medium">
                        {recipient.eventName}
                      </td>
                      <td className="py-3.5 px-6">
                        <StatusBadge status={recipient.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        {isCompleted ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setPreviewRecipient(recipient)}
                              title="Preview PDF Certificate"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-brand bg-purple-50 hover:bg-purple-100 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Preview</span>
                            </button>

                            <button
                              onClick={() => handleDownload(recipient)}
                              disabled={downloadingId === recipient.id}
                              title="Download PDF Certificate"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-brand hover:bg-brand-hover shadow-2xs transition-colors disabled:opacity-50"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Download</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            {recipient.status === 'failed' ? 'Failed' : 'Pending'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Displaying <b>{filteredRecipients.length}</b> records
          </span>
          <span className="text-slate-400">PDFs served directly from FastAPI</span>
        </div>
      </div>

      {/* Certificate In-Browser Preview Modal */}
      <CertificatePreviewModal
        isOpen={Boolean(previewRecipient)}
        onClose={() => setPreviewRecipient(null)}
        recipient={previewRecipient}
      />
    </div>
  );
};

export default CertificateManagement;
