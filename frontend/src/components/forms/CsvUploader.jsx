import React, { useState, useRef } from 'react';
import { UploadCloud, FileSpreadsheet, Download, CheckCircle, AlertCircle, X } from 'lucide-react';
import { parseRecipientsCsv, downloadSampleCsv } from '../../utils/csvParser';

export const CsvUploader = ({ onRecipientsLoaded, onClear }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const processFile = async (file) => {
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a valid .csv file format.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await parseRecipientsCsv(file);
      setFileInfo({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        total: result.totalRows,
        valid: result.validCount,
        invalid: result.invalidCount,
      });
      onRecipientsLoaded(result.recipients);
    } catch (err) {
      setError(err.message || 'Failed to parse CSV file.');
      onClear();
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleReset = () => {
    setFileInfo(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
    onClear();
  };

  return (
    <div className="space-y-4">
      {/* Sample Download Bar */}
      <div className="flex items-center justify-between p-3.5 bg-purple-50/60 rounded-xl border border-purple-100 text-xs">
        <div className="flex items-center gap-2 text-purple-900 font-medium">
          <FileSpreadsheet className="w-4 h-4 text-brand" />
          <span>Need the proper format? Download our sample CSV template</span>
        </div>
        <button
          type="button"
          onClick={downloadSampleCsv}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-purple-200 text-brand font-semibold hover:bg-purple-100 shadow-xs transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Sample CSV</span>
        </button>
      </div>

      {/* Drop Zone */}
      {!fileInfo ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-brand bg-purple-50/50'
              : 'border-slate-200 hover:border-brand/60 bg-slate-50/40 hover:bg-slate-50'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            onChange={handleChange}
            className="hidden"
          />

          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-brand flex items-center justify-center mx-auto mb-3 shadow-xs">
            <UploadCloud className="w-6 h-6" />
          </div>

          <h4 className="text-sm font-semibold text-navy-900">
            {loading ? 'Processing CSV file...' : 'Click to upload or drag & drop CSV'}
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Standard UTF-8 CSV containing <b>Name</b> and <b>Email</b> columns (up to 1,000 rows)
          </p>
        </div>
      ) : (
        /* Loaded File Summary Card */
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-brand flex items-center justify-center flex-shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-sm text-navy-900">{fileInfo.name}</div>
              <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span>{fileInfo.size}</span>
                <span>•</span>
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {fileInfo.valid} Valid
                </span>
                {fileInfo.invalid > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-rose-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {fileInfo.invalid} Errors
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Replace File</span>
            </button>
          </div>
        </div>
      )}

      {/* Error notification */}
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default CsvUploader;
