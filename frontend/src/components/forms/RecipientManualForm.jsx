import React from 'react';
import { Plus, Trash2, Sparkles, AlertCircle } from 'lucide-react';
import { validateRecipient } from '../../utils/validators';

const SAMPLE_RECIPIENTS = [
  { name: 'Priyanshi Sharma', email: 'priyanshi@example.com' },
  { name: 'Rahul Verma', email: 'rahul.verma@example.com' },
  { name: 'Ananya Patel', email: 'ananya.patel@example.com' },
];

export const RecipientManualForm = ({ recipients, onChange }) => {
  const handleAddRow = () => {
    onChange([
      ...recipients,
      {
        id: `manual-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        name: '',
        email: '',
        isValid: false,
        nameError: null,
        emailError: null,
      },
    ]);
  };

  const handleRowChange = (index, field, value) => {
    const updated = [...recipients];
    const item = { ...updated[index], [field]: value };
    const validation = validateRecipient(item);

    updated[index] = {
      ...item,
      isValid: validation.isValid,
      nameError: validation.nameError,
      emailError: validation.emailError,
    };

    onChange(updated);
  };

  const handleRemoveRow = (index) => {
    if (recipients.length <= 1) {
      // Keep at least one empty row
      onChange([
        {
          id: `manual-${Date.now()}`,
          name: '',
          email: '',
          isValid: false,
          nameError: null,
          emailError: null,
        },
      ]);
      return;
    }
    const updated = recipients.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleFillSample = () => {
    const filled = SAMPLE_RECIPIENTS.map((sample, idx) => {
      const validation = validateRecipient(sample);
      return {
        id: `sample-${idx}-${Date.now()}`,
        name: sample.name,
        email: sample.email,
        isValid: validation.isValid,
        nameError: null,
        emailError: null,
      };
    });
    onChange(filled);
  };

  const handleClearAll = () => {
    onChange([
      {
        id: `manual-${Date.now()}`,
        name: '',
        email: '',
        isValid: false,
        nameError: null,
        emailError: null,
      },
    ]);
  };

  return (
    <div className="space-y-4">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
        <span className="text-xs font-semibold text-slate-600">
          Manual Recipient Entries ({recipients.length})
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFillSample}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 text-brand text-xs font-semibold hover:bg-purple-100 transition-colors border border-purple-200/60"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fill Sample Data</span>
          </button>

          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs text-slate-500 hover:text-rose-600 px-2 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Rows List */}
      <div className="space-y-3">
        {recipients.map((recipient, index) => {
          return (
            <div
              key={recipient.id || index}
              className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-start gap-3 transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-2">
                {index + 1}
              </div>

              {/* Name Field */}
              <div className="flex-1">
                <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">
                  Recipient Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={recipient.name}
                  onChange={(e) => handleRowChange(index, 'name', e.target.value)}
                  placeholder="e.g. Priyanshi Sharma"
                  className={`w-full px-3 py-2 text-xs sm:text-sm bg-white rounded-lg border ${
                    recipient.nameError
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-brand focus:ring-purple-200'
                  } focus:outline-none focus:ring-2 transition-all`}
                />
                {recipient.nameError && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    {recipient.nameError}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="flex-1">
                <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={recipient.email}
                  onChange={(e) => handleRowChange(index, 'email', e.target.value)}
                  placeholder="e.g. priya@example.com"
                  className={`w-full px-3 py-2 text-xs sm:text-sm bg-white rounded-lg border ${
                    recipient.emailError
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-brand focus:ring-purple-200'
                  } focus:outline-none focus:ring-2 transition-all`}
                />
                {recipient.emailError && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    {recipient.emailError}
                  </p>
                )}
              </div>

              {/* Delete button */}
              <div className="sm:mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleRemoveRow(index)}
                  title="Remove recipient"
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add row button */}
      <button
        type="button"
        onClick={handleAddRow}
        className="w-full py-2.5 border-2 border-dashed border-slate-200 hover:border-brand/60 rounded-xl text-xs font-semibold text-slate-600 hover:text-brand flex items-center justify-center gap-2 hover:bg-purple-50/40 transition-all"
      >
        <Plus className="w-4 h-4" />
        <span>Add Another Recipient</span>
      </button>
    </div>
  );
};

export default RecipientManualForm;
