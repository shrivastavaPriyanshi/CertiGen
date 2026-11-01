import React, { useState, useEffect } from 'react';
import { Download, ExternalLink, AlertCircle, FileCheck } from 'lucide-react';
import Modal from '../common/Modal';
import LoadingSpinner from '../common/LoadingSpinner';
import api, { getErrorMessage } from '../../services/api';

export const CertificatePreviewModal = ({ isOpen, onClose, recipient }) => {
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activeUrl = null;

    if (isOpen && recipient?.id && recipient.status === 'completed') {
      setLoading(true);
      setError(null);

      api
        .downloadCertificateBlob(recipient.id)
        .then((blob) => {
          activeUrl = URL.createObjectURL(blob);
          setBlobUrl(activeUrl);
        })
        .catch((err) => {
          setError(getErrorMessage(err));
        })
        .finally(() => {
          setLoading(false);
        });
    }

    return () => {
      if (activeUrl) {
        URL.revokeObjectURL(activeUrl);
      }
    };
  }, [isOpen, recipient]);

  const handleDownload = () => {
    if (!blobUrl) return;
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `certificate_${recipient.name.replace(/\s+/g, '_')}_${recipient.id.slice(0, 8)}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={recipient ? `Certificate Preview — ${recipient.name}` : 'Certificate Preview'}
      subtitle={recipient ? `Recipient Email: ${recipient.email} • ID: ${recipient.id}` : ''}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-4">
        {loading && (
          <div className="h-[460px] flex items-center justify-center bg-slate-50 rounded-xl border border-slate-200">
            <LoadingSpinner label="Fetching personalized PDF certificate..." size="lg" />
          </div>
        )}

        {error && (
          <div className="p-6 text-center bg-rose-50 border border-rose-200 rounded-xl">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <h4 className="font-semibold text-rose-900">Failed to load certificate preview</h4>
            <p className="text-xs text-rose-600 mt-1 max-w-md mx-auto">{error}</p>
          </div>
        )}

        {!loading && !error && blobUrl && (
          <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900">
            <iframe
              src={blobUrl}
              title="Certificate PDF Preview"
              className="w-full h-[520px] bg-slate-100"
            />
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-emerald-500" />
            <span>Official ReportLab generated certificate</span>
          </div>

          <div className="flex items-center gap-2">
            {blobUrl && (
              <a
                href={blobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in New Tab</span>
              </a>
            )}

            <button
              onClick={handleDownload}
              disabled={!blobUrl}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand hover:bg-brand-hover shadow-sm disabled:opacity-50 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CertificatePreviewModal;
