export const formatDate = (dateString) => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 30) return 'Just now';
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;

    return formatDate(dateString);
  } catch {
    return dateString;
  }
};

export const getStatusMeta = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return {
        label: 'Completed',
        variant: 'success',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
      };
    case 'completed_with_errors':
      return {
        label: 'Completed with Errors',
        variant: 'warning',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'processing':
      return {
        label: 'Processing',
        variant: 'info',
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
        dot: 'bg-purple-500',
        animate: true,
      };
    case 'queued':
      return {
        label: 'Queued',
        variant: 'neutral',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        dot: 'bg-blue-500',
        animate: true,
      };
    case 'failed':
      return {
        label: 'Failed',
        variant: 'danger',
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        dot: 'bg-rose-500',
      };
    case 'pending':
      return {
        label: 'Pending',
        variant: 'neutral',
        bg: 'bg-slate-50',
        text: 'text-slate-600',
        border: 'border-slate-200',
        dot: 'bg-slate-400',
      };
    default:
      return {
        label: status || 'Unknown',
        variant: 'neutral',
        bg: 'bg-slate-50',
        text: 'text-slate-600',
        border: 'border-slate-200',
        dot: 'bg-slate-400',
      };
  }
};
