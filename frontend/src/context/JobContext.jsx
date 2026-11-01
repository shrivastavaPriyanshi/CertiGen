import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api, { getErrorMessage } from '../services/api';

const JobContext = createContext(null);

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState({ online: false, checking: true });
  const pollingRef = useRef(null);

  // Check backend health
  const checkHealth = useCallback(async () => {
    try {
      const data = await api.getHealth();
      setBackendStatus({ online: data?.status === 'healthy', checking: false });
    } catch {
      setBackendStatus({ online: false, checking: false });
    }
  }, []);

  // Fetch all jobs
  const fetchJobs = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const data = await api.getAllJobs();
      setJobs(Array.isArray(data) ? data : []);
      setError(null);
      setBackendStatus((prev) => ({ ...prev, online: true, checking: false }));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      if (!quiet) setLoading(false);
    }
  }, []);

  // Compute aggregated stats
  const stats = React.useMemo(() => {
    const totalJobs = jobs.length;
    let totalCertificates = 0;
    let successfulCertificates = 0;
    let failedCertificates = 0;

    jobs.forEach((job) => {
      totalCertificates += job.total_recipients || 0;
      successfulCertificates += job.successful_count || 0;
      failedCertificates += job.failed_count || 0;
    });

    return {
      totalJobs,
      totalCertificates,
      successfulCertificates,
      failedCertificates,
    };
  }, [jobs]);

  // Submit new job
  const createJob = async (jobPayload) => {
    const response = await api.createJob(jobPayload);
    // Refresh jobs list immediately
    await fetchJobs(true);
    return response;
  };

  // Fetch full details of a single job
  const getJobDetails = async (jobId) => {
    return await api.getJobStatus(jobId);
  };

  // Setup periodic polling for in-progress jobs
  useEffect(() => {
    const hasActiveJob = jobs.some(
      (j) => j.status === 'queued' || j.status === 'processing'
    );

    if (hasActiveJob) {
      pollingRef.current = setInterval(() => {
        fetchJobs(true);
      }, 2500);
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [jobs, fetchJobs]);

  // Initial load
  useEffect(() => {
    checkHealth();
    fetchJobs();

    // Check health every 30 seconds
    const healthInterval = setInterval(checkHealth, 30000);
    return () => clearInterval(healthInterval);
  }, [checkHealth, fetchJobs]);

  const value = {
    jobs,
    stats,
    loading,
    error,
    backendStatus,
    fetchJobs,
    checkHealth,
    createJob,
    getJobDetails,
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};

export default JobContext;
