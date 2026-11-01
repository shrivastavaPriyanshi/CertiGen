import React, { useState, useMemo } from 'react';
import { Eye, Download, Search, AlertCircle, FileText, Filter } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';
import api from '../../services/api';

export const RecipientTable = ({ recipients = [], onPreview }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [downloadingId, setDownloadingId] = useState(null);

  const filteredRecipients = useMemo(() => {
    return recipients.filter((r) => {
      const matchesSearch =
        (r.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.email || '').toLowerCase().includes(searchTerm.toLowerCase());

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
      console.error('Download failed', err);
    } finally {
      setDownloadingId(null);
    }
  };

  if (!recipients || recipients.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No Recipients Recorded"
        description="There are currently no recipients associated with this batch."
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
      {/* Search and Filters toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search recipient by name or email..."
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
            <option value="ALL">All Statuses ({recipients.length})</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Recipients Table */}
      {filteredRecipients.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-slate-500">No recipients match your search or filter.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
              <tr>
                <th className="py-3 px-4 sm:px-6">Recipient Name</th>
                <th className="py-3 px-4 sm:px-6">Email Address</th>
                <th className="py-3 px-4 sm:px-6">Status</th>
                <th className="py-3 px-4 sm:px-6">Notes / Error</th>
                <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecipients.map((recipient) => {
                const isCompleted = recipient.status === 'completed';
                const isFailed = recipient.status === 'failed';

                return (
                  <tr key={recipient.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-navy-900">
                      {recipient.name || <span className="text-slate-400 italic">Empty name</span>}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-slate-600 font-mono text-xs">
                      {recipient.email || <span className="text-slate-400 italic">Empty email</span>}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      <StatusBadge status={recipient.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-xs text-slate-500 max-w-xs truncate">
                      {isFailed && recipient.error_message ? (
                        <span className="inline-flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100 font-medium">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{recipient.error_message}</span>
                        </span>
                      ) : isCompleted ? (
                        <span className="text-emerald-600 font-medium">PDF Generated</span>
                      ) : (
                        <span className="text-slate-400">In queue</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      {isCompleted ? (
                        <div className="flex items-center justify-end gap-1.5">
                          {onPreview && (
                            <button
                              onClick={() => onPreview(recipient)}
                              title="Preview Certificate"
                              className="p-1.5 rounded-lg text-slate-600 hover:text-brand hover:bg-purple-50 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDownload(recipient)}
                            disabled={downloadingId === recipient.id}
                            title="Download PDF"
                            className="p-1.5 rounded-lg text-slate-600 hover:text-brand hover:bg-purple-50 transition-colors disabled:opacity-50"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Unavailable</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Table Footer */}
      <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing <b>{filteredRecipients.length}</b> of <b>{recipients.length}</b> recipients
        </span>
        <span className="text-slate-400">
          {recipients.filter((r) => r.status === 'completed').length} Generated •{' '}
          {recipients.filter((r) => r.status === 'failed').length} Failed
        </span>
      </div>
    </div>
  );
};

export default RecipientTable;
