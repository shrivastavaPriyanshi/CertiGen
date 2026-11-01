import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  FileSpreadsheet,
  Edit3,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { useToast } from '../context/ToastContext';
import CsvUploader from '../components/forms/CsvUploader';
import RecipientManualForm from '../components/forms/RecipientManualForm';
import {
  validateEventName,
  validateCompletionDate,
  validateRecipientsList,
} from '../utils/validators';
import { getErrorMessage } from '../services/api';

export const CreateCertificates = () => {
  const navigate = useNavigate();
  const { createJob } = useJobs();
  const toast = useToast();

  // Form State
  const [eventName, setEventName] = useState('');
  const [completionDate, setCompletionDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [inputMode, setInputMode] = useState('manual'); // 'manual' | 'csv'

  // Recipients State
  const [manualRecipients, setManualRecipients] = useState([
    {
      id: `manual-1`,
      name: '',
      email: '',
      isValid: false,
      nameError: null,
      emailError: null,
    },
  ]);
  const [csvRecipients, setCsvRecipients] = useState([]);

  // Submission & Validation States
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Current active recipients based on tab
  const activeRecipients = inputMode === 'manual' ? manualRecipients : csvRecipients;
  const validationSummary = validateRecipientsList(
    activeRecipients.map((r) => ({ name: r.name, email: r.email }))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate Event Name
    const eventError = validateEventName(eventName);
    const dateError = validateCompletionDate(completionDate);

    const errors = {};
    if (eventError) errors.eventName = eventError;
    if (dateError) errors.completionDate = dateError;

    if (!activeRecipients || activeRecipients.length === 0) {
      errors.recipients = 'Please provide at least one recipient.';
    } else if (validationSummary.validCount === 0) {
      errors.recipients = 'Please ensure at least one recipient is valid.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fix the highlighted form errors before proceeding.');
      return;
    }

    setFormErrors({});
    setSubmitting(true);

    try {
      // Clean recipient payload (only name & email)
      const payloadRecipients = activeRecipients.map((r) => ({
        name: (r.name || '').trim(),
        email: (r.email || '').trim(),
      }));

      const payload = {
        event_name: eventName.trim(),
        completion_date: completionDate,
        recipients: payloadRecipients,
      };

      const response = await createJob(payload);
      toast.success(
        `Job queued successfully! Processing ${response.total_recipients} certificates in the background.`
      );
      navigate(`/history/${response.job_id}`);
    } catch (err) {
      const msg = getErrorMessage(err);
      toast.error(msg, 'Generation Failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-navy-900 tracking-tight">
          Create Bulk Certificate Batch
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Configure event details and provide recipient records manually or via CSV upload.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Event Information Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <span className="w-6 h-6 rounded-full bg-purple-100 text-brand text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h3 className="font-bold text-base text-navy-900">Event Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Event Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Event / Course Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => {
                  setEventName(e.target.value);
                  if (formErrors.eventName) {
                    setFormErrors((prev) => ({ ...prev, eventName: null }));
                  }
                }}
                placeholder="e.g. Advanced Python Masterclass 2026"
                className={`w-full px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white rounded-xl border ${
                  formErrors.eventName
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-brand focus:ring-purple-200'
                } text-sm text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all`}
              />
              {formErrors.eventName ? (
                <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {formErrors.eventName}
                </p>
              ) : (
                <p className="text-[11px] text-slate-400 mt-1">
                  This title will be printed prominently on the certificate.
                </p>
              )}
            </div>

            {/* Completion Date */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Completion Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={completionDate}
                  onChange={(e) => {
                    setCompletionDate(e.target.value);
                    if (formErrors.completionDate) {
                      setFormErrors((prev) => ({ ...prev, completionDate: null }));
                    }
                  }}
                  className={`w-full px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white rounded-xl border ${
                    formErrors.completionDate
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-brand focus:ring-purple-200'
                  } text-sm text-navy-900 focus:outline-none focus:ring-2 transition-all`}
                />
              </div>
              {formErrors.completionDate && (
                <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {formErrors.completionDate}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Step 2: Recipients Data Source Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-brand text-xs font-bold flex items-center justify-center">
                2
              </span>
              <div>
                <h3 className="font-bold text-base text-navy-900">Recipient Records</h3>
                <p className="text-xs text-slate-500">
                  Choose your input method: enter recipients dynamically or upload a CSV file.
                </p>
              </div>
            </div>

            {/* Tab switch */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setInputMode('manual')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  inputMode === 'manual'
                    ? 'bg-white text-navy-900 shadow-xs'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-brand" />
                <span>Manual Entry</span>
              </button>

              <button
                type="button"
                onClick={() => setInputMode('csv')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  inputMode === 'csv'
                    ? 'bg-white text-navy-900 shadow-xs'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-brand" />
                <span>CSV Upload</span>
              </button>
            </div>
          </div>

          {/* Tab content */}
          {inputMode === 'manual' ? (
            <RecipientManualForm
              recipients={manualRecipients}
              onChange={setManualRecipients}
            />
          ) : (
            <CsvUploader
              onRecipientsLoaded={setCsvRecipients}
              onClear={() => setCsvRecipients([])}
            />
          )}

          {formErrors.recipients && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <span>{formErrors.recipients}</span>
            </div>
          )}
        </div>

        {/* Step 3: Validation Overview & Submission Summary */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-semibold text-sm text-navy-900">Pre-Flight Batch Validation</h4>
            <span className="text-xs text-slate-500">
              Total Count: <b>{activeRecipients.length}</b>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="text-xs text-slate-500">Total Recipients</span>
              <p className="text-xl font-bold text-navy-900 mt-0.5">
                {activeRecipients.length}
              </p>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="text-xs text-emerald-700 flex items-center justify-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Valid Entries
              </span>
              <p className="text-xl font-bold text-emerald-700 mt-0.5">
                {validationSummary.validCount}
              </p>
            </div>

            <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
              <span className="text-xs text-rose-700 flex items-center justify-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                Invalid / Errors
              </span>
              <p className="text-xl font-bold text-rose-700 mt-0.5">
                {validationSummary.invalidCount}
              </p>
            </div>
          </div>

          {validationSummary.invalidCount > 0 && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Attention: </span>
                {validationSummary.invalidCount} recipient record(s) contain invalid fields (e.g.
                empty name or invalid email). The backend will process valid recipients and mark
                invalid ones as failed without interrupting the batch.
              </div>
            </div>
          )}

          {/* Submission Bar */}
          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/history')}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-navy-900 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || validationSummary.validCount === 0}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand hover:bg-brand-hover text-white text-sm font-semibold shadow-md shadow-purple-600/20 disabled:opacity-50 transition-all hover:-translate-y-0.5"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Batch Job...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate {validationSummary.validCount} Certificate(s)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCertificates;
