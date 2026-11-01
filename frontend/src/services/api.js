import axios from 'axios';

// Base URL configured via environment variable (empty string by default to use Vite dev proxy)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Response error handler helper
export const getErrorMessage = (error) => {
  if (error.response?.data?.detail) {
    if (typeof error.response.data.detail === 'string') {
      return error.response.data.detail;
    }
    if (Array.isArray(error.response.data.detail)) {
      return error.response.data.detail.map((err) => err.msg || err.message).join(', ');
    }
  }
  return error.message || 'An unexpected error occurred';
};

// API Service Endpoints
export const api = {
  // Health check
  getHealth: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },

  // Retrieve all jobs
  getAllJobs: async () => {
    const response = await apiClient.get('/api/jobs');
    return response.data;
  },

  // Create a new bulk generation job
  createJob: async (jobData) => {
    // Expected jobData: { event_name: string, completion_date: string (YYYY-MM-DD), recipients: [{ name, email }] }
    const response = await apiClient.post('/api/jobs', jobData);
    return response.data;
  },

  // Get status and recipients of a specific job
  getJobStatus: async (jobId) => {
    const response = await apiClient.get(`/api/jobs/${jobId}`);
    return response.data;
  },

  // Get recipient certificates for a specific job
  getJobCertificates: async (jobId) => {
    const response = await apiClient.get(`/api/jobs/${jobId}/certificates`);
    return response.data;
  },

  // Download certificate PDF as a Blob
  downloadCertificateBlob: async (certificateId) => {
    const response = await apiClient.get(`/api/certificates/${certificateId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Direct download URL helper
  getCertificateDownloadUrl: (certificateId) => {
    return `${BASE_URL}/api/certificates/${certificateId}/download`;
  },
};

export default api;
